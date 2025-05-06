package com.rhythm_of_soul.identity_service.service.impl;

import com.rhythm_of_soul.identity_service.constant.Role;
import com.rhythm_of_soul.identity_service.constant.SecurityConstants;
import com.rhythm_of_soul.identity_service.constant.Status;
import com.rhythm_of_soul.identity_service.dto.request.UserCreationRequest;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import com.rhythm_of_soul.identity_service.entity.Account;
import com.rhythm_of_soul.identity_service.entity.User;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.repository.AccountRepository;
import com.rhythm_of_soul.identity_service.repository.UserRepository;
import com.rhythm_of_soul.identity_service.service.AccountService;
import com.rhythm_of_soul.identity_service.utils.JwtUtils;
import com.rhythm_of_soul.identity_service.utils.OtpUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountServiceImp implements AccountService {
    AccountRepository accountRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtUtils jwtUtil;
    OtpUtils otpUtils;

    @Override
    @Transactional
    public AuthenticationResponse register(UserCreationRequest userCreatedRequest) {
        if(accountRepository.existsByEmail(userCreatedRequest.getEmail()))
            throw new AppException(ErrorCode.EMAIL_EXISTED);

        Account account = Account.builder()
                .email(userCreatedRequest.getEmail())
                .password(passwordEncoder.encode(userCreatedRequest.getPassword()))
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();

        try {
            // create user profile for each account
            User user = User.builder()
                    .account(accountRepository.save(account))
                    .firstName(userCreatedRequest.getFirstName())
                    .lastName(userCreatedRequest.getLastName())
                    .phoneNumber(userCreatedRequest.getPhoneNumber())
                    .build();

            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }

        return AuthenticationResponse.builder()
                .token(jwtUtil.generateToken(account, false))
                .build();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void sendVerificationRequest() {
        Account account = accountRepository.findById(jwtUtil.getAccountInContext())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (account.isVerified()) throw new AppException(ErrorCode.ACCOUNT_VERIFIED);

        otpUtils.send(SecurityConstants.VERIFY_OTP, account.getEmail());
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public String verifyAccount(String otp) {
        Account account = accountRepository.findById(jwtUtil.getAccountInContext())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (account.isVerified()) throw new AppException(ErrorCode.ACCOUNT_VERIFIED);

        if (!otpUtils.verify(SecurityConstants.VERIFY_OTP, account.getEmail(), otp))
            throw new AppException(ErrorCode.INVALID_OTP);

        try {
            account.setVerified(true);
            accountRepository.save(account);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }

        return "Your account verified successfully.";
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public boolean isAccountVerified(String accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        return account.isVerified();
    }

    @Override
    public void sendPasswordResetRequest(String email) {

    }

    @Override
    public boolean resetPassword(String email, String otpResetPass, String newPassword) {
        return false;
    }

    @Override
    public void changePassword(String accountId, String oldPassword, String newPassword) {

    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void lockAccount(String accountId) {

    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void unlockAccount(String accountId) {

    }

    @Override
    public boolean isAccountLocked(String accountId) {
        return false;
    }

}
