package com.rhythm_of_soul.content_service.service.Impl;

import com.rhythm_of_soul.content_service.entity.Like;
import com.rhythm_of_soul.content_service.entity.Post;
import com.rhythm_of_soul.content_service.exception.AppException;
import com.rhythm_of_soul.content_service.exception.ErrorCode;
import com.rhythm_of_soul.content_service.repository.LikeRepository;
import com.rhythm_of_soul.content_service.repository.PostRepository;
import com.rhythm_of_soul.content_service.service.LikeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LikeServiceImpl implements LikeService {
    LikeRepository likeRepository;
    PostRepository postRepository;

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    public boolean like(String accountId, String targetId) {
        boolean alreadyLiked = likeRepository.existsByAccountIdAndPostId(accountId, targetId);
        if (alreadyLiked) {
            return false;
        }

        Like like = Like.builder().accountId(accountId)
                .postId(targetId)
                .createdAt(Instant.now())
                .build();

        Post post = postRepository.findById(targetId).orElseThrow(
                () -> new AppException(ErrorCode.POST_NOT_FOUND)
        );
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);

        likeRepository.save(like);
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
        Post post = postRepository.findById(targetId).orElseThrow(
                () -> new AppException(ErrorCode.POST_NOT_FOUND)
        );
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

        // Trả ra danh sách accountId đã like
        return likesPage.getContent()
                .stream()
                .map(Like::getAccountId)
                .collect(Collectors.toList());
    }
}
