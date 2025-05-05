package com.rhythm_of_soul.identity_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @OneToOne
    @JoinColumn(name = "account_id")
    Account account;

    @Column(length = 400, nullable = false, unique = true)
    String token;

    @Column(nullable = false)
    Instant expiryTime;
}
