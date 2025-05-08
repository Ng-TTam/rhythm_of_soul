package com.rhythm_of_soul.identity_service.entity;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.rhythm_of_soul.identity_service.constant.Gender;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @OneToOne
    @JoinColumn(name = "account_id")
    Account account;

    @Column(nullable = false)
    String firstName;

    @Column(nullable = false)
    String lastName;

    LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    Gender gender;

    String phoneNumber;

    boolean isArtist;

    @Column(length = 500)
    String avatar;

    @Column(length = 500)
    String cover;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    ArtistProfile artistProfile;

    @CreatedDate
    Instant createdAt;

    @LastModifiedDate
    Instant updatedAt;
}
