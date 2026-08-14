package com.rhythm_of_soul.application.service.like.impl;

import com.rhythm_of_soul.application.model.request.LikeCommentRequest;
import com.rhythm_of_soul.application.service.Identity.IdentityClient;
import com.rhythm_of_soul.application.service.like.LikeService;
import com.rhythm_of_soul.application.service.publisher.RedisPublisher;
import com.rhythm_of_soul.domain.model.entity.Like;
import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.repository.LikeRepository;
import com.rhythm_of_soul.domain.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LikeServiceImpl implements LikeService {
    LikeRepository likeRepository;
    PostRepository postRepository;
    RedisPublisher redisPublisher;
    IdentityClient identityClient;

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    public boolean like(String accountId, String targetId) {
        boolean alreadyLiked = likeRepository.existsByAccountIdAndPostId(accountId, targetId);
        if (alreadyLiked) {
            return false;
        }

        Post post = postRepository.findById(targetId);
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);

        likeRepository.save(targetId, accountId);

        try {
            String postAuthorId = post.getAccountId();

            LikeCommentRequest event = new LikeCommentRequest();
            event.setAuthorId(identityClient.getUserInfoByAccountId(accountId).getUserId());            // người like
            event.setPostAuthorId(identityClient.getUserInfoByAccountId(postAuthorId).getUserId());     // chủ bài post
            event.setReferenceId(post.getId());
            event.setAuthorName(identityClient.getUserInfoByAccountId(accountId).getName());         // tên người like
            event.setType("LIKE");

            redisPublisher.publishLikeCommentEvent(event);
        } catch (Exception e) {
            log.error("Failed to send like event", e);
        }
        return true;
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    public boolean unlike(String accountId, String targetId) {
        boolean existed = likeRepository.existsByAccountIdAndPostId(accountId, targetId);
        if (!existed) {
            return false;
        }
        Post post = postRepository.findById(targetId);
        post.setLikeCount(post.getLikeCount() - 1);
        postRepository.save(post);

        likeRepository.deleteByAccountIdAndPostId(accountId, targetId);
        return true;
    }

    @Override
    public boolean isLiked(String accountId, String targetId) {
        return likeRepository.existsByAccountIdAndPostId(accountId, targetId);
    }

    @Override
    public long countLikes(String targetId) {
        return 0;
    }

    @Override
    public List<String> getUserLikes(String targetId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Like> likesPage = likeRepository.findByPostId(targetId, pageable);

        return likesPage.getContent()
                .stream()
                .map(Like::getAccountId)
                .collect(Collectors.toList());
    }
}
