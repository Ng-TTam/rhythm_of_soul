package com.rhythm_of_soul.identity_service.repository;

import com.rhythm_of_soul.identity_service.constant.Role;
import com.rhythm_of_soul.identity_service.constant.Status;
import com.rhythm_of_soul.identity_service.entity.Account;
import com.rhythm_of_soul.identity_service.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Account> findByUser(User user);

    @Query("""
    SELECT a FROM Account a
    WHERE a.role IN :roles
    AND (:status IS NULL OR a.status = :status)
    AND (:keySearch IS NULL OR LOWER(a.email) LIKE LOWER(CONCAT('%', :keySearch, '%')))
    """)
    Page<Account> findByRoleInAndOptionalStatus(
            @Param("roles") List<Role> roles,
            @Param("status") Status status,
            @Param("keySearch") String keySearch,
            Pageable pageable
    );


}
