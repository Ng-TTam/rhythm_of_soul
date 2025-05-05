package com.rhythm_of_soul.identity_service.api;

import com.rhythm_of_soul.identity_service.dto.request.ArtistProfileRequest;
import com.rhythm_of_soul.identity_service.dto.request.UserCreationRequest;
import com.rhythm_of_soul.identity_service.dto.response.ApiResponse;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import com.rhythm_of_soul.identity_service.dto.response.UserResponse;
import com.rhythm_of_soul.identity_service.service.AccountService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountController {
    AccountService accountService;

    @PostMapping("/api/sign-up")
    ApiResponse<AuthenticationResponse> signUp(@Valid @RequestBody UserCreationRequest userCreationRequest){
        return ApiResponse.<AuthenticationResponse>builder()
                .result(accountService.register(userCreationRequest))
                .build();
    }

    @PostMapping("/verify/send")
    ApiResponse<Void> sendVerification(){
        accountService.sendVerificationRequest();
        return ApiResponse.<Void>builder()
                .message("Send verification email successful!!!")
                .build();
    }
    
    @PostMapping("/verify")
    ApiResponse<Void> verifyAccount(@RequestBody String otp){
        return ApiResponse.<Void>builder()
                .message(accountService.verifyAccount(otp))
                .build();
    }

    @PostMapping("/assign-artist")
    ApiResponse<Void> assignArtist(@Valid @RequestBody ArtistProfileRequest artistProfileRequest){
        accountService.assignRoleArtist(artistProfileRequest);
        return ApiResponse.<Void>builder()
                .message("Assign artist successful!!!")
                .build();
    }

    @PostMapping("/upgrade-artist/{accountId}")
    ApiResponse<UserResponse> upgradeArtist(@PathVariable String accountId){
        return null;
    }

    @PostMapping("/revoke-artist/{accountId}")
    ApiResponse<UserResponse> revokeArtist(@PathVariable String accountId){
        return null;
    }



}
