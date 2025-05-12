package com.rhythm_of_soul.identity_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // sys - 9xxx
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR(9001, "Internal error", HttpStatus.INTERNAL_SERVER_ERROR),
    MISSING_REFRESH_TOKEN(9002, "Missing refresh token", HttpStatus.INTERNAL_SERVER_ERROR),
    ERROR_SEND_OTP(9003, "Error sending otp", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_OTP(9004, "Invalid otp", HttpStatus.INTERNAL_SERVER_ERROR),

    // auth - 1xxx
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1002, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1003, "You do not have permission", HttpStatus.FORBIDDEN),
    ACCOUNT_NOT_FOUND(1004, "Account not found", HttpStatus.NOT_FOUND),
    ACCOUNT_VERIFIED(1005, "Account verified", HttpStatus.CONFLICT),
    BLANK_TOKEN(1006, "Blank token", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_VERIFIED(
            1007, "Account not verified, you need to verify your account to upgrade artist", HttpStatus.UNAUTHORIZED),
    ACCOUNT_ALREADY_LOCKED(1008, "Account is already locked", HttpStatus.CONFLICT),
    ACCOUNT_NOT_LOCKED(1009, "Account is not locked", HttpStatus.BAD_REQUEST),

    // user - 2xxx
    INVALID_USERNAME(2001, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(2002, "Password must be at least {min}-{max} characters", HttpStatus.BAD_REQUEST),
    INVALID_DOB(2003, "Invalid date of birth, dob is in future or present", HttpStatus.BAD_REQUEST),
    USER_EXISTED(2004, "User existed", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(2005, "Email existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(2006, "User not existed", HttpStatus.NOT_FOUND),
    IS_ARTIST(2007, "Is artist", HttpStatus.BAD_REQUEST),
    BLANK_FIRST_NAME(2008, "First name is blank", HttpStatus.BAD_REQUEST),
    BLANK_LAST_NAME(2009, "Last name is blank", HttpStatus.BAD_REQUEST),
    BLANK_EMAIL(2010, "Email is blank", HttpStatus.BAD_REQUEST),
    BLANK_DOB(2011, "Date of birth is blank", HttpStatus.BAD_REQUEST),
    BLANK_GENDER(2012, "Gender is blank", HttpStatus.BAD_REQUEST),
    BLANK_PASSWORD(2013, "Password is blank", HttpStatus.BAD_REQUEST),
    BLANK_PHONE_NUMBER(2014, "Phone number is blank", HttpStatus.BAD_REQUEST),
    INVALID_PHONE_NUMBER(
            2015,
            "Invalid phone number, phone number contain character 0-9 and length is 9-13",
            HttpStatus.BAD_REQUEST),
    BLANK_STAGE_NAME(2016, "Stage name is blank", HttpStatus.BAD_REQUEST),
    BLANK_ARTIST_PROFILE(2017, "You are Artist, your profile is blank", HttpStatus.BAD_REQUEST),

    // follow - 3xxx
    ALREADY_FOLLOWING(3000, "Follow already exists", HttpStatus.CONFLICT),
    FOLLOW_NOT_FOUND(3001, "Follow not found", HttpStatus.BAD_REQUEST),
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
