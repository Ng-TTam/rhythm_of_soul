package com.rhythm_of_soul.identity_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rhythm_of_soul.identity_service.entity.Account;
import com.rhythm_of_soul.identity_service.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByAccount(Account account);

    void deleteByToken(String token);
}
