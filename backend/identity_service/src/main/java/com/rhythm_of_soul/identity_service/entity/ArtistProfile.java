package com.rhythm_of_soul.identity_service.entity;

import java.time.Instant;

import jakarta.persistence.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.rhythm_of_soul.identity_service.constant.ArtistProfileStatus;

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
public class ArtistProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, length = 100)
    String stageName;

    @Column(length = 5000)
    String bio;

    String facebookUrl;

    String instagramUrl;

    String youtubeUrl;

    @Enumerated(EnumType.STRING)
    ArtistProfileStatus status;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @CreatedDate
    Instant createdAt;

    @LastModifiedDate
    Instant updatedAt;
}
