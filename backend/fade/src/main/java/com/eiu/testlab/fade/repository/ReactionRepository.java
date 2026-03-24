package com.eiu.testlab.fade.repository;

import com.eiu.testlab.fade.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReactionRepository extends JpaRepository<Reaction, UUID> {
    Optional<Reaction> findByPostIdAndUserId(UUID postId, UUID userId);
    List<Reaction> findByUserIdAndPostIdIn(UUID userId, List<UUID> postIds);
}
