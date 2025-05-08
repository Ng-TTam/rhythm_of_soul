package com.rhythm_of_soul.identity_service.constant;

public class SecurityConstants {
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String ACCESS_TOKEN = "access_token";
    public static final String ACCESS_TOKEN_SSO = "access_token_sso";
    public static final String REFRESH_TOKEN = "refresh_token";
    public static final String ADMIN_EMAIL = "admin@gmail.com";
    public static final String ADMIN_PASSWORD = "admin_admin";
    public static final String REDIRECT_URI_KEY = "redirect_uri";
    public static final String VERIFY_OTP = "VERIFY_OTP";
    public static final String RESET_PASSWORD_OTP = "RESET_PASSWORD_OTP";
    public static final String PRE_RESET_PASS = "TOKEN_RESET_PASS_";
    public static final int TTL_TOKEN_RESET_CACHE = 5;
    public static final String STREAM_OTP_KEY = "otp";
    public static final String STREAM_BAN_KEY = "ban_user";
}
