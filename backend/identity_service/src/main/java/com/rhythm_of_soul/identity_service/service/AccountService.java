package com.rhythm_of_soul.identity_service.service;

import com.rhythm_of_soul.identity_service.dto.request.ArtistProfileRequest;
import com.rhythm_of_soul.identity_service.dto.request.UserCreationRequest;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import org.springframework.security.access.AccessDeniedException;

public interface AccountService {
    /**
     * @param userCreatedRequest info to register
     * @return access token after login and create account, user in system
     */
    AuthenticationResponse register(UserCreationRequest userCreatedRequest);

    /**
     * send verify request to user (send email OTP code), get id in token.
     *
     * @throws IllegalArgumentException if accountId invalid
     * @throws RuntimeException if send fail
     */
    void sendVerificationRequest();

    /**
     * Verify account base ont OTP.
     *
     * @param otp otp user provide
     * @return string verify successful
     * @throws IllegalArgumentException if accountId of otp invalid
     */
    String verifyAccount(String otp);

    /**
     * Check verification of account.
     *
     * @param accountId ID of user
     * @return true if verified else false
     */
    boolean isAccountVerified(String accountId);

    /**
     * User assign ARTIST role for account.
     *
     * @param artistProfileRequest extra profile of artist
     * @throws AccessDeniedException if user haven't permission
     * @throws IllegalArgumentException if accountId or roleName invalid
     */
    void assignRoleArtist(ArtistProfileRequest artistProfileRequest);

    /**
     * Admin submit ARTIST role of account.
     *
     * @param accountId ID account
     * @throws AccessDeniedException if user haven't permission -> ADMIN can
     * @throws IllegalArgumentException if accountId or roleName invalid
     */
    void upgradeRoleArtist(String accountId);

    /**
     * Admin revoke ARTIST role of account.
     *
     * @param accountId ID account
     * @throws AccessDeniedException if user haven't permission -> ADMIN can
     * @throws IllegalArgumentException if accountId or roleName invalid
     */
    void revokeRoleArtist(String accountId);

    /**
     * Send request reset pass (send otp by email).
     *
     * @param email Email of user
     * @throws IllegalArgumentException if email invalid
     * @throws RuntimeException if send fail
     */
    void sendPasswordResetRequest(String email);

    /**
     * Verify and reset new password base on otp reset.
     *
     * @param email Email of user
     * @param otpResetPass otp reset pass of user provide
     * @param newPassword new pass
     * @return true if success else false
     * @throws IllegalArgumentException if email, otpResetPass or newPassword invalid
     */
    boolean resetPassword(String email, String otpResetPass, String newPassword);

    /**
     * Change pass.
     *
     * @param accountId ID of user's account
     * @param oldPassword old pass
     * @param newPassword new pass
     * @throws IllegalArgumentException if accountId, oldPassword or newPassword invalid
     * @throws AccessDeniedException if old pass invalid
     */
    void changePassword(String accountId, String oldPassword, String newPassword);

    /**
     * Lock user account.
     *
     * @param accountId ID of account need lock
     * @throws IllegalArgumentException if accountId invalid
     * @throws AccessDeniedException if user haven't permission
     */
    void lockAccount(String accountId);

    /**
     * Unlock user account.
     *
     * @param accountId ID of account need unlock
     * @throws IllegalArgumentException if accountId invalid
     * @throws AccessDeniedException if user haven't permission
     */
    void unlockAccount(String accountId);

    /**
     * Check status of account (lock or unlock).
     *
     * @param accountId ID of user account
     * @return true if account locked else false
     */
    boolean isAccountLocked(String accountId);
}
