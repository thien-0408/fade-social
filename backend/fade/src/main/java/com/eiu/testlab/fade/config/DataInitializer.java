package com.eiu.testlab.fade.config;

import com.eiu.testlab.fade.entity.Profile;
import com.eiu.testlab.fade.entity.User;
import com.eiu.testlab.fade.enums.Gender;
import com.eiu.testlab.fade.enums.UserStatus;
import com.eiu.testlab.fade.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner { //to log
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    @Override
    @Transactional //make sure user and profile created
    public void run(String... args) throws Exception {
        if (userRepo.count() == 0) {
            log.info("Database empty. Initializing default admin accounts...");

            User admin = User.builder()
                    .role("ADMIN")
                    .userName("admin")
                    .passwordHash(encoder.encode("Admin@123!"))
                    .email("admin@fade.com")
                    .status(UserStatus.ACTIVE)
                    .build();

            Profile adminProfile = Profile.builder()
                    .fullName("System Administrator")
                    .bio("I am the root user of Fade social network.")
                    .dateOfBirth(LocalDate.of(1990, 1, 1))
                    .user(admin)
                    .gender(Gender.MALE)
                    .avatarUrl("uploads/avatars/admin-avatar.jpg")
                    .phoneNumber("0123456789")
                    .build();
            admin.setProfile(adminProfile);
            userRepo.save(admin);
            log.info("Default admin account created: admin@fade.com");
        }else {
            log.info("Database already contains data. Skipping initialization.");
        }
    }
}
