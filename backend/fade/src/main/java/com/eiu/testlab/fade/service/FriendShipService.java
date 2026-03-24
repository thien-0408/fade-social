package com.eiu.testlab.fade.service;

import com.eiu.testlab.fade.dto.FriendShip.FriendRequestResponse;
import com.eiu.testlab.fade.dto.UserResponse;
import com.eiu.testlab.fade.entity.FriendShip;
import com.eiu.testlab.fade.entity.Notification;
import com.eiu.testlab.fade.entity.User;
import com.eiu.testlab.fade.enums.ErrorCode;
import com.eiu.testlab.fade.enums.FriendShipStatus;
import com.eiu.testlab.fade.enums.NotificationType;
import com.eiu.testlab.fade.exception.AppException;
import com.eiu.testlab.fade.mapper.UserMapper;
import com.eiu.testlab.fade.repository.FriendShipRepository;
import com.eiu.testlab.fade.repository.NotificationRepository;
import com.eiu.testlab.fade.repository.UserRepository;
import com.eiu.testlab.fade.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendShipService {
    UserRepository userRepository;
    UserMapper userMapper;
    FriendShipRepository friendShipRepository;
    NotificationRepository notificationRepository;
    SseService sseService;

    public void sendFriendRequest(UUID receiverID){

        UUID senderID = SecurityUtils.getCurrentUserId();
        if(receiverID.equals(senderID)){
            throw new AppException(ErrorCode.CANNOT_ADD_SELF);
        }
        //check other friend status and self
        boolean exists = friendShipRepository.existsByRequesterIdAndAddresseeId(senderID, receiverID)
                || friendShipRepository.existsByRequesterIdAndAddresseeId(receiverID, senderID);
        if (exists) {
            throw new AppException(ErrorCode.FRIENDSHIP_EXISTED);
        }
        User requester = userRepository.findById(senderID).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));
        User receiver = userRepository.findById(receiverID).orElseThrow(()-> new AppException(ErrorCode.USER_NOT_FOUND));

        FriendShip friendship = FriendShip.builder()
                .requester(requester)
                .addressee(receiver)
                .status(FriendShipStatus.PENDING) //set pending for request
                .createdAt(LocalDateTime.now())
                .build();
        friendship = friendShipRepository.save(friendship);

        // Notify Receiver
        Notification notification = Notification.builder()
                .recipient(receiver)
                .actor(requester)
                .type(NotificationType.FRIEND_REQUEST)
                .relatedEntityId(friendship.getId())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        // Build Payload
        String payloadMsg = String.format("%s sent you a friend request", 
            requester.getProfile() != null && requester.getProfile().getFullName() != null 
            ? requester.getProfile().getFullName() : requester.getUserName());
        
        // Push SSE
        sseService.sendNotification(receiverID, Map.of(
                "id", notification.getId(),
                "relatedEntityId", friendship.getId(),
                "type", NotificationType.FRIEND_REQUEST.name(),
                "message", payloadMsg,
                "actorId", requester.getId(),
                "actorName", requester.getUserName(),
                "timestamp", notification.getCreatedAt().toString()
        ));
    }

    @Transactional
    public void acceptFriendRequest(UUID requestId){
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        FriendShip friendShip = friendShipRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOTFOUND));

        //check if current user really has request to accept
        if (!friendShip.getAddressee().getId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
//        if (friendShip.getStatus() != FriendShipStatus.PENDING) {
//            throw new AppException(ErrorCode.INVALID_STATUS);
//        }
        friendShip.setStatus(FriendShipStatus.ACCEPTED);
        notificationRepository.deleteByRelatedEntityIdAndType(requestId, NotificationType.FRIEND_REQUEST);
    }

    @Transactional
    public void declineFriendRequest(UUID requestId){
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        FriendShip friendShip = friendShipRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOTFOUND));

        //only owner can decline
        if (!friendShip.getAddressee().getId().equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (friendShip.getStatus() != FriendShipStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }
        notificationRepository.deleteByRelatedEntityIdAndType(requestId, NotificationType.FRIEND_REQUEST);
        friendShipRepository.delete(friendShip);
    }
    public List<UserResponse> getUserFriends(UUID userId) {
        List<FriendShip> friendships = friendShipRepository.findAllFriendsByUserId(userId);
        return friendships.stream().map(f -> {
            User friend = f.getRequester().getId().equals(userId) ? f.getAddressee() : f.getRequester();
            return userMapper.toResponse(friend);
        }).collect(Collectors.toList());
    }

    public List<FriendRequestResponse> getIncomingList(){
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        List<FriendShip> pendingList = friendShipRepository.findByAddresseeIdAndStatus(currentUserId, FriendShipStatus.PENDING);
        return pendingList.stream().map(request -> {
            User requester = request.getRequester();

            String fullName = requester.getUserName();
            String avatar = null;

            if (requester.getProfile() != null) {
                if (requester.getProfile().getFullName() != null) {
                    fullName = requester.getProfile().getFullName();
                }
                avatar = requester.getProfile().getAvatarUrl();
            }

            return FriendRequestResponse.builder()
                    .requestId(request.getId())
                    .requesterId(requester.getId())
                    .userName(requester.getUserName())
                    .fullName(fullName)
                    .avatarUrl(avatar)
                    .createdAt(request.getCreatedAt())
                    .build();

        }).collect(Collectors.toList());
    }

    @Transactional
    public void unfriend(UUID targetUserId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        FriendShip friendShip = friendShipRepository.findFriendshipBetween(currentUserId, targetUserId)
                .orElseThrow(() -> new AppException(ErrorCode.FRIENDSHIP_NOTFOUND));
        
        friendShipRepository.delete(friendShip);
    }

    public String checkFriendshipStatus(UUID targetUserId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        
        if (currentUserId.equals(targetUserId)) {
            return "SELF";
        }

        Optional<FriendShip> friendshipOpt = friendShipRepository.findFriendshipBetween(currentUserId, targetUserId);
        
        if (friendshipOpt.isEmpty()) {
            return "NONE";
        }
        
        FriendShip friendShip = friendshipOpt.get();
        if (friendShip.getStatus() == FriendShipStatus.ACCEPTED) {
            return "FRIENDS";
        }
        
        // Return PENDING_SENT if current user sent it, otherwise PENDING_RECEIVED
        if (friendShip.getRequester().getId().equals(currentUserId)) {
            return "PENDING_SENT";
        } else {
            return "PENDING_RECEIVED";
        }
    }
}
