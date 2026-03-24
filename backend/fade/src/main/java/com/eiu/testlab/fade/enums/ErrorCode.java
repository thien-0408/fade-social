package com.eiu.testlab.fade.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    USER_EXISTED(1001, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    INVALID_KEY(1003, "Invalid message key", HttpStatus.BAD_REQUEST),
    INVALID_STATUS(1004, "Invalid friendship status", HttpStatus.BAD_REQUEST),
    INVALID_POST_TYPE(2004, "Invalid post type", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(4004, "Wrong password", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(5004, "Unauthorized", HttpStatus.BAD_REQUEST),
    PROFILE_EXISTED(1005, "User already has a profile", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1006, "Email already existed", HttpStatus.BAD_REQUEST),
    CANNOT_ADD_SELF(3001, "Can not self add", HttpStatus.BAD_REQUEST),
    FRIENDSHIP_EXISTED(3002, "Friendship already set", HttpStatus.BAD_REQUEST),
    FRIENDSHIP_NOTFOUND(3004, "Friendship not found", HttpStatus.BAD_REQUEST),
    ACCOUNT_BANNED(2001, "User has been banned", HttpStatus.BAD_REQUEST),
    POST_NOT_FOUND(4001, "Post does not exist", HttpStatus.NOT_FOUND),
    PASSWORD_NOT_MATCH(3001, "Password not match", HttpStatus.BAD_REQUEST),
    CHATROOM_NOT_FOUND(6001, "Chat room not found", HttpStatus.NOT_FOUND),
    MESSAGE_NOT_FOUND(6002, "Message not found", HttpStatus.NOT_FOUND),
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    ;

    ErrorCode(int code, String message, HttpStatus statusCode){
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
    private int code;
    private String message;
    private final HttpStatus statusCode;
}
