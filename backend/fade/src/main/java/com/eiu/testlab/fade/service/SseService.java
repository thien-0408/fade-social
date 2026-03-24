package com.eiu.testlab.fade.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class SseService {

    // Thread-safe map to hold SseEmitters for each user
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(UUID userId) {
        // Create an emitter with a 30 minute timeout
        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> {
            log.info("SSE emitter completed for user: {}", userId);
            emitters.remove(userId);
        });

        emitter.onTimeout(() -> {
            log.info("SSE emitter timed out for user: {}", userId);
            emitter.complete();
            emitters.remove(userId);
        });

        emitter.onError(e -> {
            log.warn("SSE emitter error for user: {}", userId, e);
            emitter.completeWithError(e);
            emitters.remove(userId);
        });

        // Send a dummy connection event to confirm to the client it's connected
        try {
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data("Connected to SSE stream"));
        } catch (IOException e) {
            emitter.completeWithError(e);
            emitters.remove(userId);
        }

        return emitter;
    }

    public void sendNotification(UUID userId, Object eventData) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("NOTIFICATION")
                        .data(eventData));
            } catch (IOException e) {
                emitter.completeWithError(e);
                emitters.remove(userId);
            }
        }
    }
}
