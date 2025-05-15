package com.rhythm_of_soul.identity_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rhythm_of_soul.identity_service.entity.Follow;
import com.rhythm_of_soul.identity_service.entity.User;

public interface FollowRepository extends JpaRepository<Follow, String> {
    boolean existsByFollowerAndFollowed(User follower, User followed);

    Optional<Follow> findByFollowerAndFollowed(User follower, User followed);

    List<Follow> findAllByFollowed(User followed);
    List<Follow> findAllByFollower(User follower);
}
