package com.rhythm_of_soul.identity_service.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.identity_service.constant.SecurityConstants;
import com.rhythm_of_soul.identity_service.dto.request.FollowRequest;
import com.rhythm_of_soul.identity_service.dto.request.OtpRequest;
import com.rhythm_of_soul.identity_service.service.RedisPublisher;
import com.rhythm_of_soul.identity_service.utils.AESUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
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

import javax.crypto.SecretKey;

@Service
@RequiredArgsConstructor
@Slf4j
public class FollowServiceImpl implements FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final UserSecurity userSecurity;

    private final RedisPublisher redisPublisher;

    @Override
    @Transactional
    public void follow(String followedId) {
        try {
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

            currentUser.setFollowedCount(currentUser.getFollowedCount() + 1);
            userRepository.save(currentUser);

            String followerName = currentUser.getFirstName() + currentUser.getLastName();

            FollowRequest request = new FollowRequest(currentUser.getId(), followerName, followedId);
            redisPublisher.publishFollowEvent(request);

        } catch (Exception e){
            log.error("Error follow: ", e);
            throw new AppException(ErrorCode.FOLLOW_NOT_PUSH);
        }
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

        currentUser.setFollowedCount(currentUser.getFollowedCount()-1);
        userRepository.save(currentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getFollowers(String userId) {
        User followed = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Follow> follows = followRepository.findAllByFollowed(followed);
        return follows.stream().map(Follow::getFollower).collect(Collectors.toList());
    }
}
