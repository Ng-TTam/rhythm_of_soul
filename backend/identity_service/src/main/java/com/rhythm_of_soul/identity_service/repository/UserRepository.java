package com.rhythm_of_soul.identity_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rhythm_of_soul.identity_service.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    @Query("SELECT u FROM User u WHERE u.account.id = :accountId")
    Optional<User> findByAccountId(String accountId);

    @Query("SELECT u FROM User u WHERE u.account.email = :email")
    Optional<User> findByAccountEmail(@Param("email") String email);

    Page<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName, String lastName, Pageable pageable);

    @Query("SELECT ap.user FROM ArtistProfile ap WHERE ap.status = 'PENDING'")
    List<User> findAllUsersWithPendingArtistRequest();

}
