package com.rhythm_of_soul.identity_service.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.rhythm_of_soul.identity_service.entity.User;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Component("userSecurity")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserSecurity {
    private static final Logger log = LoggerFactory.getLogger(UserSecurity.class);
    UserRepository userRepository;

    public boolean isProfileOwner(String userId) {
        var accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository
                .findByAccountId(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userId.equals(user.getId());
    }

    public User getCurrentUser() {
        String accountId =
                SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("id: {}", accountId);
        return userRepository
                .findByAccountId(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }
}
