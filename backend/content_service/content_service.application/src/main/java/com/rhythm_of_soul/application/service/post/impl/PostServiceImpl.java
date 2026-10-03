package com.rhythm_of_soul.application.service.post.impl;

import com.rhythm_of_soul.application.factory.PostContentFactory;
import com.rhythm_of_soul.application.factory.file.FileUploadFactory;
import com.rhythm_of_soul.application.factory.file.FileUploadStrategy;
import com.rhythm_of_soul.application.factory.strategy.PostContentStrategy;
import com.rhythm_of_soul.application.mapper.LikeMapper;
import com.rhythm_of_soul.application.mapper.PostMapper;
import com.rhythm_of_soul.application.model.request.*;
import com.rhythm_of_soul.application.model.response.*;
import com.rhythm_of_soul.application.service.Identity.IdentityClient;
import com.rhythm_of_soul.application.service.post.PostService;
import com.rhythm_of_soul.application.service.publisher.RedisPublisher;
import com.rhythm_of_soul.domain.model.entity.Comment;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.entity.Like;
import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import com.rhythm_of_soul.domain.repository.CommentRepository;
import com.rhythm_of_soul.domain.repository.LikeRepository;
import com.rhythm_of_soul.domain.repository.PostRepository;
import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import com.rhythm_of_soul.application.service.comment.impl.CommentManager;
import com.rhythm_of_soul.infrastructure.utils.SaveFileMinio;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class PostServiceImpl implements PostService {
    PostRepository postRepository;
    CommentRepository commentRepository;
    LikeRepository likeRepository;
    PostMapper postMapper;
    LikeMapper likeMapper;
    SaveFileMinio saveFileMinio;
    MinioConfig minioConfig;
    IdentityClient identityClient;
    RedisPublisher redisPublisher;
    PostContentFactory postContentFactory;
    FileUploadFactory fileUploadFactory;

    @Override
    public PostResponse createPost(String accountId, PostRequest postRequest) {
        Post post = postMapper.toPost(postRequest);

        // Execute factory pattern strategy based on Post Type
        PostContentStrategy strategy = postContentFactory.getStrategy(postRequest.getType());
        strategy.validate(postRequest.getContent());
        post.setContent(strategy.createContent(postRequest.getContent()));

        // set accountId using accountId in token
        post.setAccountId(accountId);

        postRepository.save(post);
        PostResponse postResponse = postMapper.toPostResponse(post);
        if (post.getContent() != null) {
            postResponse.setContent(strategy.enrichContentResponse(post.getContent(), postResponse.getContent()));
        }
        postResponse.set_liked(false);

        List<String> followerIds = identityClient.getFollowerIds(accountId);
        log.info("Fetched followerIds: {}", followerIds);

        for (String followerId : followerIds) {
            NewContentEvent event = new NewContentEvent(
                    identityClient.getUserInfoByAccountId(accountId).getUserId(),
                    identityClient.getUserInfoByAccountId(accountId).getName(),
                    post.getType().name(),
                    followerId,
                    post.getId()
            );
            redisPublisher.publishNewContentEvent(event);
            log.info("success push to id: {}", followerId);
        }
        return postResponse;
    }

    @Override
    public PostResponse updatePost(String postId, PostRequest postRequest) {
        Post post = postRepository.findById(postId);
        if (post == null) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }
        post.setUpdatedAt(Instant.now());
        if (postRequest.getCaption() != null) {
            post.setCaption(postRequest.getCaption());
        }
        if (postRequest.getIsPublic() != null) {
            post.setPublic(postRequest.getIsPublic());
        }

        // Execute factory strategy to update post content
        PostContentStrategy strategy = postContentFactory.getStrategy(post.getType());
        strategy.validate(postRequest.getContent());
        Content updatedContent = strategy.updateContent(post.getContent(), postRequest.getContent());
        post.setContent(updatedContent);

        postRepository.save(post);
        PostResponse postResponse = postMapper.toPostResponse(post);
        if (post.getContent() != null) {
            postResponse.setContent(strategy.enrichContentResponse(post.getContent(), postResponse.getContent()));
        }

        postResponse.set_liked(likeRepository.existsByAccountIdAndPostId(post.getAccountId(), post.getId()));
        return postResponse;
    }

    @Override
    public PostResponse addSong(String postId, String songIds) {
        Post post = postRepository.findById(postId);
        if (post == null) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }
        if (post.getContent().getSongIds() == null) {
            post.getContent().setSongIds(new ArrayList<>());
        }
        List<String> songList = post.getContent().getSongIds();
        songList.add(songIds);
        post.getContent().setSongIds(songList);
        post.setUpdatedAt(Instant.now());
        postRepository.save(post);
        PostResponse postResponse = postMapper.toPostResponse(post);

        PostContentStrategy strategy = postContentFactory.getStrategy(post.getType());
        ContentResponse content = strategy.enrichContentResponse(post.getContent(), postResponse.getContent());
        postResponse.setContent(content);
        return postResponse;
    }

    @Override
    public List<PostResponse> getSongs(String accountId) {
        List<Post> posts = postRepository.findAllByAccountIdAndType(accountId, Type.SONG);
        List<PostResponse> postResponses = new ArrayList<>();
        PostContentStrategy strategy = postContentFactory.getStrategy(Type.SONG);
        for (Post post : posts) {
            PostResponse postResponse = postMapper.toPostResponse(post);
            if (post.getContent() != null) {
                postResponse.setContent(strategy.enrichContentResponse(post.getContent(), postResponse.getContent()));
            }
            postResponse.set_liked(likeRepository.existsByAccountIdAndPostId(accountId, post.getId()));
            postResponses.add(postResponse);
        }
        return postResponses;
    }

    @Override
    public List<PostResponse> getPlaylists(String accountId) {
        List<Post> posts = postRepository.findAllByAccountIdAndType(accountId, Type.PLAYLIST);
        List<PostResponse> postResponses = new ArrayList<>();
        PostContentStrategy strategy = postContentFactory.getStrategy(Type.PLAYLIST);
        for (Post post : posts) {
            PostResponse postResponse = postMapper.toPostResponse(post);
            if (post.getContent() != null) {
                ContentResponse content = strategy.enrichContentResponse(post.getContent(), postResponse.getContent());
                postResponse.setContent(content);
            }
            postResponse.set_liked(likeRepository.existsByAccountIdAndPostId(accountId, post.getId()));
            postResponses.add(postResponse);
        }
        return postResponses;
    }

    @Override
    public List<AlbumResponse> getAlbum(String accountId) {
        List<Post> posts = postRepository.findAllByAccountIdAndType(accountId, Type.ALBUM);
        List<AlbumResponse> albumResponses = new ArrayList<>();
        for (Post post : posts) {
            AlbumResponse albumResponse = AlbumResponse.builder()
                    .id(post.getId())
                    .title(post.getContent() != null ? post.getContent().getTitle() : null)
                    .imageUrl(post.getContent() != null ? saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()) : null)
                    .coverUrl(post.getContent() != null ? saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()) : null)
                    .tracks(post.getContent() != null && post.getContent().getSongIds() != null ? post.getContent().getSongIds().size() : 0)
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt() != null ? post.getUpdatedAt() : null)
                    .tags(post.getContent() != null ? post.getContent().getTags() : null)
                    .isPublic(post.isPublic())
                    .accountId(post.getAccountId())
                    .viewCount(post.getViewCount())
                    .isLiked(likeRepository.existsByAccountIdAndPostId(accountId, post.getId()))
                    .likeCount(post.getLikeCount())
                    .caption(post.getCaption())
                    .commentCount(post.getCommentCount())
                    .scheduledAt(post.getScheduledAt() != null ? post.getScheduledAt() : null)
                    .build();
            albumResponses.add(albumResponse);
        }
        return albumResponses;
    }

    @Override
    public List<BasicPlaylistResponse> getBasicPlaylists(String accountId, String songId) {
        List<Post> posts = postRepository.findAllByAccountIdAndType(accountId, Type.PLAYLIST);
        List<BasicPlaylistResponse> basicPlaylistResponses = new ArrayList<>();
        for (Post post : posts) {
            if (post.getContent() != null && (post.getContent().getSongIds() == null || !post.getContent().getSongIds().contains(songId))) {
                BasicPlaylistResponse basicPlaylistResponse = BasicPlaylistResponse.builder()
                        .id(post.getId())
                        .name(post.getContent().getTitle())
                        .build();
                basicPlaylistResponses.add(basicPlaylistResponse);
            }
        }
        return basicPlaylistResponses;
    }

    @Override
    public List<PostResponse> searchPosts(String accountId, String keyword, String tag, Type type, int page, int size) {
        return List.of();
    }

    @Override
    public PostDetailResponse getPostDetail(String accountId, String postId) {
        Post post = postRepository.findById(postId);
        if (post == null) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }
        PostResponse postResponse = postMapper.toPostResponse(post);

        if (accountId != null)
            postResponse.set_liked(likeRepository.existsByAccountIdAndPostId(accountId, postId));

        if (post.getContent() != null) {
            PostContentStrategy strategy = postContentFactory.getStrategy(post.getType());
            ContentResponse content = strategy.enrichContentResponse(post.getContent(), postResponse.getContent());
            postResponse.setContent(content);
        }

        List<Like> likes = likeRepository.findAllByPostId(postId);
        return PostDetailResponse.builder()
                .post(postResponse)
                .likes(likes.stream().map(likeMapper::toLikeResponse).toList())
                .comments(getComments(postId))
                .build();
    }

    @Override
    public PostResponse getPost(String postId) {
        Post post = postRepository.findById(postId);
        if (post == null) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }
        PostResponse postResponse = postMapper.toPostResponse(post);
        if (post.getContent() != null) {
            PostContentStrategy strategy = postContentFactory.getStrategy(post.getType());
            ContentResponse content = strategy.enrichContentResponse(post.getContent(), postResponse.getContent());
            postResponse.setContent(content);
        }

        return postResponse;
    }

    @Override
    public List<SongResponse> getListSongs(Pageable pageable) {
        List<Post> posts = postRepository.findAllByType(Type.SONG, pageable);
        List<SongResponse> songsResponse = new ArrayList<>();
        for (Post post : posts) {
            if (post.getContent() != null) {
                songsResponse.add(SongResponse.builder()
                        .songId(post.getId())
                        .title(post.getContent().getTitle())
                        .mediaUrl(post.getContent().getMediaUrl())
                        .imageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()))
                        .coverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()))
                        .tags(post.getContent().getTags())
                        .build());
            }
        }
        return songsResponse;
    }

    @Override
    public String createFile(MultipartFile file, String type) {
        FileUploadStrategy strategy = fileUploadFactory.getStrategy(type);
        String bucketName = strategy.getBucketName(minioConfig);
        return saveFileMinio.saveFile(file, bucketName);
    }

    @Override
    public List<CommentResponse> getComments(String postId) {
        List<Comment> comments = commentRepository.findAllByPostId(postId);
        CommentManager manager = new CommentManager();
        for (Comment comment : comments) {
            String parentId = comment.getParentId();
            manager.addDepartment(comment.getId(), comment.getAccountId(), parentId, comment.getContent(), comment.getCreatedAt(), comment.getUpdatedAt(), comment.isUserIsArtist());
        }

        return manager.getAllDepartments();
    }
}
