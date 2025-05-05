package com.rhythm_of_soul.identity_service.repository;

import com.rhythm_of_soul.identity_service.entity.Account;
import com.rhythm_of_soul.identity_service.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByAccount(Account account);
    void deleteByAccount(Account account);
}
