package com.rhythm_of_soul.identity_service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rhythm_of_soul.identity_service.entity.Follow;
import com.rhythm_of_soul.identity_service.entity.User;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.repository.FollowRepository;
import com.rhythm_of_soul.identity_service.repository.UserRepository;
import com.rhythm_of_soul.identity_service.security.UserSecurity;
import com.rhythm_of_soul.identity_service.service.FollowService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final UserSecurity userSecurity;

    @Override
    @Transactional
    public void follow(String followedId) {
        User currentUser = userSecurity.getCurrentUser();
        User followed =
                userRepository.findById(followedId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (followRepository.existsByFollowerAndFollowed(currentUser, followed)) {
            throw new AppException(ErrorCode.ALREADY_FOLLOWING);
        }

        Follow follow =
                Follow.builder().follower(currentUser).followed(followed).build();

        followRepository.save(follow);

        followed.setFollowerCount(followed.getFollowerCount() + 1);
        userRepository.save(followed);
    }

    @Override
    @Transactional
    public void unfollow(String followedId) {
        User currentUser = userSecurity.getCurrentUser();
        User followed =
                userRepository.findById(followedId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Follow follow = followRepository
                .findByFollowerAndFollowed(currentUser, followed)
                .orElseThrow(() -> new AppException(ErrorCode.FOLLOW_NOT_FOUND));

        followRepository.delete(follow);

        followed.setFollowerCount(Math.max(0, followed.getFollowerCount() - 1));
        userRepository.save(followed);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getFollowers(String userId) {
        User followed = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Follow> follows = followRepository.findAllByFollowed(followed);
        return follows.stream().map(Follow::getFollower).collect(Collectors.toList());
    }
}
