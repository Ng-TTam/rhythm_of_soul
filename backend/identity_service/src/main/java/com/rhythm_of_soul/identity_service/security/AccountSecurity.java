package com.rhythm_of_soul.identity_service.security;

import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("accountSecurity")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountSecurity {
    UserRepository userRepository;

    public boolean isProfileOwner(String userId) {
        var accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        return userId.equals(userRepository.findByAccountId(accountId).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND)
            )
                .getAccount()
                .getId());
    }
}
