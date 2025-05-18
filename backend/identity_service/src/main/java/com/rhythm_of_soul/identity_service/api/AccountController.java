package com.rhythm_of_soul.identity_service.api;

import java.util.List;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.rhythm_of_soul.identity_service.constant.Role;
import com.rhythm_of_soul.identity_service.constant.Status;
import com.rhythm_of_soul.identity_service.dto.request.LockAccountRequest;
import com.rhythm_of_soul.identity_service.dto.request.PasswordResetRequest;
import com.rhythm_of_soul.identity_service.dto.request.PasswordResetVerifyRequest;
import com.rhythm_of_soul.identity_service.dto.request.UserCreationRequest;
import com.rhythm_of_soul.identity_service.dto.response.AccountResponse;
import com.rhythm_of_soul.identity_service.dto.response.ApiResponse;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import com.rhythm_of_soul.identity_service.service.AccountService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountController {
    private static final Logger log = LoggerFactory.getLogger(AccountController.class);
    AccountService accountService;

    @PostMapping("/api/sign-up")
    ApiResponse<AuthenticationResponse> signUp(@Valid @RequestBody UserCreationRequest userCreationRequest) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(accountService.register(userCreationRequest))
                .build();
    }

    @PostMapping("/verify/send")
    ApiResponse<Void> sendVerification() {
        accountService.sendVerificationRequest();
        return ApiResponse.<Void>builder()
                .message("Send verification email successful!!!")
                .build();
    }

    @PostMapping("/verify")
    ApiResponse<Void> verifyAccount(@RequestBody String otp) {
        return ApiResponse.<Void>builder()
                .message(accountService.verifyAccount(otp))
                .build();
    }

    @PatchMapping("/account/lock/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> lockAccount(@PathVariable String accountId, @RequestBody LockAccountRequest request) {
        accountService.lockAccount(accountId, request.getReason());
        return ApiResponse.<Void>builder()
                .message("Account locked successfully")
                .build();
    }

    @PatchMapping("/account/unlock/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<Void> unlockAccount(@PathVariable String accountId) {
        accountService.unlockAccount(accountId);
        return ApiResponse.<Void>builder()
                .message("Account unlocked successfully")
                .build();
    }

    @GetMapping("/accounts")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<AccountResponse>>> getAllAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<Role> roles,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) String keySearch) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AccountResponse> accountPage = accountService.getFilteredAccounts(roles, status, keySearch, pageable);

        ApiResponse<Page<AccountResponse>> response = ApiResponse.<Page<AccountResponse>>builder()
                .message("Get Accounts Successfully")
                .result(accountPage)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password/request")
    public ApiResponse<Void> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        accountService.sendPasswordResetRequest(request.getEmail());
        return ApiResponse.<Void>builder()
                .message("OTP has been sent to your email.")
                .build();
    }

    @PostMapping("/reset-password/verify")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody PasswordResetVerifyRequest request) {
        boolean success = accountService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ApiResponse.<Void>builder()
                .message(success ? "Password reset successfully." : "Password reset failed.")
                .build();
    }
}
