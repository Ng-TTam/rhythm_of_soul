package com.rhythm_of_soul.identity_service.service.impl;

import java.util.List;
import java.util.Map;
import javax.crypto.SecretKey;

import com.rhythm_of_soul.identity_service.dto.response.UserBasicInfoResponse;
import jakarta.transaction.Transactional;

import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.identity_service.constant.Role;
import com.rhythm_of_soul.identity_service.constant.SecurityConstants;
import com.rhythm_of_soul.identity_service.constant.Status;
import com.rhythm_of_soul.identity_service.dto.request.BanUserRequest;
import com.rhythm_of_soul.identity_service.dto.request.UserCreationRequest;
import com.rhythm_of_soul.identity_service.dto.response.AccountResponse;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import com.rhythm_of_soul.identity_service.entity.Account;
import com.rhythm_of_soul.identity_service.entity.User;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.mapper.AccountMapper;
import com.rhythm_of_soul.identity_service.repository.AccountRepository;
import com.rhythm_of_soul.identity_service.repository.UserRepository;
import com.rhythm_of_soul.identity_service.service.AccountService;
import com.rhythm_of_soul.identity_service.utils.AESUtil;
import com.rhythm_of_soul.identity_service.utils.JwtUtils;
import com.rhythm_of_soul.identity_service.utils.OtpUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AccountServiceImp implements AccountService {
    private final StringRedisTemplate stringRedisTemplate;
    AccountRepository accountRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtUtils jwtUtil;
    OtpUtils otpUtils;
    AccountMapper accountMapper;

    private final ObjectMapper objectMapper;

    private final SecretKey secretKey;
    private final RedisTemplate<String, String> redisTemplate;
    private final ApplicationContext applicationContext;

    @Override
    @Transactional
    public AuthenticationResponse register(UserCreationRequest userCreatedRequest) {
        if (accountRepository.existsByEmail(userCreatedRequest.getEmail()))
            throw new AppException(ErrorCode.EMAIL_EXISTED);

        Account account = Account.builder()
                .email(userCreatedRequest.getEmail())
                .password(passwordEncoder.encode(userCreatedRequest.getPassword()))
                .role(Role.USER)
                .isVerified(false)
                .status(Status.ACTIVE)
                .build();

        try {
            // create user profile for each account
            User user = User.builder()
                    .account(accountRepository.save(account))
                    .firstName(userCreatedRequest.getFirstName())
                    .lastName(userCreatedRequest.getLastName())
                    .phoneNumber(userCreatedRequest.getPhoneNumber())
                    .isArtist(false)
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
        Account account = accountRepository
                .findById(jwtUtil.getAccountInContext())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (account.isVerified()) throw new AppException(ErrorCode.ACCOUNT_VERIFIED);

        otpUtils.send(SecurityConstants.VERIFY_OTP, account.getEmail());
    }

    @Override
    @PreAuthorize("hasRole('USER')")
    public String verifyAccount(String otp) {
        Account account = accountRepository
                .findById(jwtUtil.getAccountInContext())
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
        Account account =
                accountRepository.findById(accountId).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        return account.isVerified();
    }

    @Override
    public void sendPasswordResetRequest(String email) {
        Account account =
                accountRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        applicationContext.getBean(OtpUtils.class).send(SecurityConstants.RESET_PASSWORD_OTP, email);
    }

    @Override
    public boolean resetPassword(String email, String otpResetPass, String newPassword) {
        Account account =
                accountRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (!otpUtils.verify(SecurityConstants.RESET_PASSWORD_OTP, email, otpResetPass)) {
            throw new AppException(ErrorCode.INVALID_OTP);
        }

        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
        return true;
    }

    @Override
    @PreAuthorize("hasAnyRole('USER', 'ARTIST')")
    public void changePassword(String accountId, String oldPassword, String newPassword) {
        Account account =
                accountRepository.findById(accountId).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (!passwordEncoder.matches(oldPassword, account.getPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void lockAccount(String accountId, String reason) {
        Account account =
                accountRepository.findById(accountId).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (account.getStatus() == Status.BANNED) throw new AppException(ErrorCode.ACCOUNT_ALREADY_LOCKED);

        account.setStatus(Status.BANNED);
        accountRepository.save(account);
        try {
            BanUserRequest request = new BanUserRequest(account.getId(), account.getEmail(), reason, "BAN_USER");
            Map<String, Object> data = objectMapper.convertValue(request, Map.class);
            String json = objectMapper.writeValueAsString(data);
            String encryptedJson = AESUtil.encrypt(json, secretKey);

            Map<String, Object> redisData = Map.of("message", encryptedJson);
            redisTemplate
                    .opsForStream()
                    .add(StreamRecords.mapBacked(redisData).withStreamKey(SecurityConstants.STREAM_BAN_KEY));

            log.info("Pushed ban user to Redis stream");
        } catch (Exception e) {
            log.error("Failed to serialize ban user data", e);
            throw new AppException(ErrorCode.INTERNAL_ERROR);
        }
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void unlockAccount(String accountId) {
        Account account =
                accountRepository.findById(accountId).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (account.getStatus() != Status.BANNED) throw new AppException(ErrorCode.ACCOUNT_NOT_LOCKED);

        account.setStatus(Status.ACTIVE);
        accountRepository.save(account);
    }

    @Override
    public boolean isAccountLocked(String accountId) {
        Account account =
                accountRepository.findById(accountId).orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        return account.getStatus() == Status.BANNED;
    }

    public Page<AccountResponse> getFilteredAccounts(
            List<Role> roles, Status status, String keySearch, Pageable pageable) {
        if (roles == null || roles.isEmpty()) {
            roles = List.of(Role.USER, Role.ARTIST);
        }

        Page<Account> accounts = accountRepository.findByRoleInAndOptionalStatus(roles, status, keySearch, pageable);
        return accounts.map(accountMapper::toAccountResponse);
    }

    public UserBasicInfoResponse getUserInfoByAccountId(String accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (account.getUser() == null) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        User user = account.getUser();

        return UserBasicInfoResponse.builder()
                .userId(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .build();
    }


}
