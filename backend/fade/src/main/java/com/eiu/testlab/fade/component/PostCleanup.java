package com.eiu.testlab.fade.component;

import com.eiu.testlab.fade.repository.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component //auto run
@Slf4j
@RequiredArgsConstructor
public class PostCleanup {
    private final PostRepository postRepository;
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void deleteExpiredPosts() {
        LocalDateTime now = LocalDateTime.now();
        int deletedCount = postRepository.deleteAllByExpiresAtBefore(now);
        if (deletedCount > 0) {
            log.info("Successfully cleaned up {} expired posts at {}", deletedCount, now);
        }
    }
}
