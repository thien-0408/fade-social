package com.eiu.testlab.fade.repository;

import com.eiu.testlab.fade.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUserName(String userName);
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    
    // For User Search
    java.util.List<User> findByUserNameContainingIgnoreCase(String userName);

    // For Online Users
    java.util.List<User> findTop15ByLastActiveAtIsNotNullOrderByLastActiveAtDesc();
}
