package com.rhythm_of_soul.content_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(9990, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1003, "You do not have permission", HttpStatus.FORBIDDEN),
    FILE_TYPE_NOT_FOUND(1004, "File not found", HttpStatus.NOT_FOUND),

    // 5xxx - post error code
    POST_NOT_FOUND(5000, "Post not found", HttpStatus.NOT_FOUND),
    SONG_NOT_FOUND(5001, "Song not found", HttpStatus.NOT_FOUND),

    // 6xxx - comment error code
    COMMENT_NOT_FOUND(6001, "Comment not found", HttpStatus.NOT_FOUND),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}