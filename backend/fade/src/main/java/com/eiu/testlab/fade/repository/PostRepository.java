package com.eiu.testlab.fade.repository;

import com.eiu.testlab.fade.dto.Post.PostResponse;
import com.eiu.testlab.fade.entity.Post;
import com.eiu.testlab.fade.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    void deleteById(UUID id);
    int deleteAllByExpiresAtBefore(LocalDateTime time);
    List<Post> findPostByOwnerId(UUID ownerId);
    Page<Post> findAllByOwnerId(UUID ownerId, Pageable pageable);
    Page<Post> findByOwnerId(UUID ownerId, Pageable pageable);
    
    // For News Feed
    Page<Post> findByExpiresAtIsNullOrExpiresAtAfter(LocalDateTime now, Pageable pageable);
}
