package com.eiu.testlab.fade.repository;

import com.eiu.testlab.fade.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {

}
