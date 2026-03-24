package com.eiu.testlab.fade.repository;

import com.eiu.testlab.fade.entity.FriendShip;
import com.eiu.testlab.fade.enums.FriendShipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FriendShipRepository extends JpaRepository<FriendShip, UUID>{
    boolean existsByRequesterIdAndAddresseeId(UUID requester, UUID receiver);
    Optional<FriendShip> findByRequesterIdAndAddresseeId(UUID receiverId, UUID requesterId);
    @Query("SELECT f FROM FriendShip f WHERE (f.requester.id = :userId OR f.addressee.id = :userId) AND f.status = 'ACCEPTED'")
    List<FriendShip> findAllFriendsByUserId(UUID userId);
    List<FriendShip> findByAddresseeIdAndStatus(UUID addresseeId, FriendShipStatus status);
    
    @Query("SELECT f FROM FriendShip f WHERE (f.requester.id = :user1 AND f.addressee.id = :user2) OR (f.requester.id = :user2 AND f.addressee.id = :user1)")
    Optional<FriendShip> findFriendshipBetween(UUID user1, UUID user2);
}
