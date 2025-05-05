package com.rhythm_of_soul.identity_service.repository;

import com.rhythm_of_soul.identity_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByAccountId(String accountId);
}
