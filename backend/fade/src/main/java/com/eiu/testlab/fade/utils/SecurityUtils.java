package com.eiu.testlab.fade.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

public class SecurityUtils {
    public static UUID getCurrentUserId(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUserStr = (String)auth.getPrincipal();
        return UUID.fromString(currentUserStr);
    }
}
