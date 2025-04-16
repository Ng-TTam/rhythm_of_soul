package com.rhythm_of_soul.identity_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rhythm_of_soul.identity_service.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    // Define custom query methods if needed
    // For example, findByUsername(String username) or findByEmail(String email)
}
