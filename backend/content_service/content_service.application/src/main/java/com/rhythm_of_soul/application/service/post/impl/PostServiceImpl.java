package com.rhythm_of_soul.application.service.post.impl;

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
import com.rhythm_of_soul.domain.model.enums.Tag;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.repository.CommentRepository;
import com.rhythm_of_soul.domain.repository.LikeRepository;
import com.rhythm_of_soul.domain.repository.PostRepository;
import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import com.rhythm_of_soul.application.service.comment.impl.CommentManager;
import com.rhythm_of_soul.infrastructure.utils.SaveFileMinio;
import com.rhythm_of_soul.infrastructure.utils.SecurityUtils;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.rmi.ServerException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    CommentRepository commentRepository;
    LikeRepository likeRepository;
    PostMapper postMapper;
    LikeMapper likeMapper;
    SaveFileMinio saveFileMinio;
    MinioConfig minioConfig;
    IdentityClient identityClient;
    RedisPublisher redisPublisher;

    // TODO: in this class can be implement by CQRS pattern
    //  apply factory and strategy pattern for create post with each type

    @Override
    public PostResponse storeFile(MultipartFile song, MultipartFile cover, MultipartFile image, String account_id, List<Tag> tags, String title, String caption, String isPublic) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        return null;
    }

    @Override
    public PostResponse createPost(String accountId, PostRequest postRequest) {
        try{
            Post post = postMapper.toPost(postRequest);
            switch (postRequest.getType()){
                case SONG:
                    post.setContent(Content.builder()
                            .tags(postRequest.getContent().getTags())
                            .title(postRequest.getContent().getTitle())
                            .mediaUrl(postRequest.getContent().getMediaUrl())
                            .coverUrl(postRequest.getContent().getCoverUrl())
                            .imageUrl(postRequest.getContent().getImageUrl())
                            .build());
                    break;
                case ALBUM, PLAYLIST:
                    post.setContent(Content.builder()
                            .tags(postRequest.getContent().getTags())
                            .title(postRequest.getContent().getTitle())
                            .imageUrl(postRequest.getContent().getImageUrl())
                            .coverUrl(postRequest.getContent().getCoverUrl())
                            .songIds(postRequest.getContent().getSongIds())
                            .build());
                    break;
                case REPOST:
                    post.setContent(Content.builder()
                            .originalPostId(postRequest.getContent().getOriginalPostId())
                            .build());
                    break;
                case TEXT:
                    break;

            }
            // set accountId using accountId in token
            post.setAccountId(accountId);

            postRepository.save(post);
            PostResponse postResponse = postMapper.toPostResponse(post);
            if(post.getType() == Type.TEXT) {
                return postResponse;
            }
            ContentResponse content = postResponse.getContent();
            content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
            content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
            postResponse.setContent(content);
            if(postRequest.getType() == Type.ALBUM || postRequest.getType() == Type.PLAYLIST){
                if(post.getContent().getSongIds() != null)  postResponse.getContent().setSongIds(getSongs(postRequest.getContent().getSongIds()));

            }
            postResponse.set_liked(false);

            List<String> followerIds = identityClient.getFollowerIds(accountId);
            log.info("Fetched followerIds: {}", followerIds);

            //TODO: logic can be wrote in notice service
            for (String followerId : followerIds) {
                NewContentEvent event = new NewContentEvent(
                        identityClient.getUserInfoByAccountId(accountId).getUserId(),
                        identityClient.getUserInfoByAccountId(accountId).getName(),
                        post.getType().name(),
                        followerId,
                        post.getId() // referenceId là id bài post
                );
                redisPublisher.publishNewContentEvent(event);
                log.info("success push to ìd: {}", followerId);
            }
            return postResponse;
        }catch (Exception e){
            log.error("Error while creating post", e);
            throw new RuntimeException("Error while creating post", e);
        }
    }

    @Override
    public PostResponse addSong(String postId, String songIds) {
        Post post = postRepository.findById(postId);
        if(post.getContent().getSongIds() == null){
            post.getContent().setSongIds(new ArrayList<>());
        }
        List<String> songList = post.getContent().getSongIds();
        songList.add(songIds);
        post.getContent().setSongIds(songList);
        post.setUpdatedAt(Instant.now());
        postRepository.save(post);
        PostResponse postResponse = postMapper.toPostResponse(post);

        ContentResponse content = postResponse.getContent();
        content.setSongIds(getSongs(songList));
        content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
        content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
        postResponse.setContent(content);
        return postResponse;
    }

    private List<SongResponse> getSongs(List<String> songIds) {
        List<SongResponse> songsResponse = new ArrayList<>();
        for(String songId : songIds){
            Post songPost = postRepository.findById(songId);
            songsResponse.add(SongResponse.builder()
                    .songId(songPost.getId())
                    .title(songPost.getContent().getTitle())
                    .mediaUrl(songPost.getContent().getMediaUrl())
                    .imageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), songPost.getContent().getImageUrl()))
                    .coverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), songPost.getContent().getCoverUrl()))
                    .tags(songPost.getContent().getTags())
                    .build());
        }
        return songsResponse;
    }

    @Override
    public List<PostResponse> getSongs(String accountId) {
        List<Post> posts = postRepository.findAllByAccountIdAndType(accountId, Type.SONG);
        List<PostResponse> postResponses = new ArrayList<>();
        for(Post post : posts){
            PostResponse postResponse = postMapper.toPostResponse(post);
            if(post.getContent() != null){
                ContentResponse content = postResponse.getContent();
                if(post.getContent().getImageUrl() != null) content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
                if(post.getContent().getCoverUrl() != null)  content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));

                postResponse.setContent(content);
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
        for(Post post : posts){
            PostResponse postResponse = postMapper.toPostResponse(post);
            if(post.getContent() != null){
                ContentResponse content = postResponse.getContent();
                if(post.getContent().getImageUrl() != null) content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
                if(post.getContent().getCoverUrl() != null)  content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
                if (post.getContent().getSongIds() != null) postResponse.getContent().setSongIds(getSongs(post.getContent().getSongIds()));
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
        for(Post post : posts){
            AlbumResponse albumResponse = AlbumResponse.builder()
                    .id(post.getId())
                    .title(post.getContent().getTitle())
                    .imageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()))
                    .coverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()))
                    .tracks(post.getContent().getSongIds() != null ? post.getContent().getSongIds().size() : 0)
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt() != null ? post.getUpdatedAt() : null)
                    .tags(post.getContent().getTags())
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
        for(Post post : posts){
            if(post.getContent().getSongIds() == null || !post.getContent().getSongIds().contains(songId)){
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
    public PostResponse updateSong(String songId, EditPostSong postRequest) {
        Post post = postRepository.findById(songId);
        if(post.getType() != Type.SONG){
            throw new RuntimeException("Post is not a song");
        }
        post.setUpdatedAt(Instant.now());
        post.setCaption(postRequest.getCaption());
        post.setPublic(postRequest.getIsPublic());
        Content content = post.getContent();
        content.setTitle(postRequest.getTitle());
        if(!postRequest.getImageUrl().contains("http://localhost:9000")) content.setImageUrl(postRequest.getImageUrl());
        if(!postRequest.getCoverUrl().contains("http://localhost:9000")) content.setCoverUrl(postRequest.getCoverUrl());
        content.setTags(postRequest.getTags());
        post.setContent(content);
        postRepository.save(post);
        PostResponse postResponse = postMapper.toPostResponse(post);
        ContentResponse contentResponse = postResponse.getContent();
        contentResponse.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
        contentResponse.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
        postResponse.setContent(contentResponse);
        postResponse.set_liked(likeRepository.existsByAccountIdAndPostId(post.getAccountId(), post.getId()));
        return postResponse;
    }

    @Override
    public AlbumResponse updateAlbum(String albumId, EditAlbum postRequest) {
        Post post = postRepository.findById(albumId);
        if(post.getType() != Type.ALBUM){
            throw new RuntimeException("Post is not a album");
        }
        post.setUpdatedAt(Instant.now());
        post.setPublic(postRequest.getIsPublic());
        post.setScheduledAt(postRequest.getScheduledAt());
        post.setCaption(postRequest.getCaption());
        Content content = post.getContent();
        content.setTitle(postRequest.getTitle());
        if(!postRequest.getImageUrl().contains("http://localhost:9000")) content.setImageUrl(postRequest.getImageUrl());
        if(!postRequest.getCoverUrl().contains("http://localhost:9000")) content.setCoverUrl(postRequest.getCoverUrl());
        content.setTags(postRequest.getTags());
        content.setSongIds(postRequest.getSongIds());
        post.setContent(content);
        postRepository.save(post);
        return AlbumResponse.builder()
                .id(post.getId())
                .title(post.getContent().getTitle())
                .imageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()))
                .coverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()))
                .tracks(post.getContent().getSongIds() != null ? post.getContent().getSongIds().size() : 0)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt() != null ? post.getUpdatedAt() : null)
                .tags(post.getContent().getTags())
                .caption(post.getCaption())
                .isPublic(post.isPublic())
                .accountId(post.getAccountId())
                .viewCount(post.getViewCount())
                .isLiked(likeRepository.existsByAccountIdAndPostId(post.getAccountId(), post.getId()))
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .scheduledAt(post.getScheduledAt() != null ? post.getScheduledAt() : null)
                .build();
    }

    @Override
    public List<PostResponse> searchPosts(String accountId, String keyword, String tag, Type type, int page, int size) {
        return List.of();
    }

    @Override
    public PostResponse updatePlaylist(String playlistId, EditPlaylist postRequest) {
        return null;
    }

    @Override
    public PostDetailResponse getPostDetail(String accountId, String postId) {
        Post post = postRepository.findById(postId);
        PostResponse postResponse = postMapper.toPostResponse(post);

        // set liked of accountId
        if(accountId != null)
            postResponse.set_liked(likeRepository.existsByAccountIdAndPostId(accountId, postId));

        if(post.getContent() != null){
            ContentResponse content = postResponse.getContent();
            if (post.getContent().getImageUrl() != null) content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
            if (post.getContent().getCoverUrl() != null) content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
            if(post.getType() == Type.ALBUM || post.getType() == Type.PLAYLIST){
                if( post.getContent().getSongIds() != null) content.setSongIds(getSongs(post.getContent().getSongIds()));
            }
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
        PostResponse postResponse = postMapper.toPostResponse(post);
        if(post.getContent() != null){
            ContentResponse content = postResponse.getContent();
            if (post.getContent().getImageUrl() != null) content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
            if (post.getContent().getCoverUrl() != null) content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
            postResponse.setContent(content);
        }
        if(post.getType() == Type.ALBUM || post.getType() == Type.PLAYLIST){
            assert post.getContent() != null;
            if( post.getContent().getSongIds() != null) postResponse.getContent().setSongIds(getSongs(post.getContent().getSongIds()));
        }

        return postResponse;
    }

    @Override
    public List<SongResponse> getListSongs(Pageable pageable) {
        List<Post> posts = postRepository.findAllByType(Type.SONG, pageable);
        List<SongResponse> songsResponse = new ArrayList<>();
        for(Post post : posts){
            songsResponse.add(SongResponse.builder()
                    .songId(post.getId())
                    .title(post.getContent().getTitle())
                    .mediaUrl(post.getContent().getMediaUrl())
                    .imageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()))
                    .coverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()))
                    .tags(post.getContent().getTags())
                    .build());
        }
        return songsResponse;
    }

    @Override
    public String createFile(MultipartFile file, String type) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        // TODO: change this code implement using factory pattern
        try{
            switch (type){
                case "song":
                    return saveFileMinio.saveFile(file, minioConfig.getSongsBucket());
                case "cover":
                    return saveFileMinio.saveFile(file, minioConfig.getCoversBucket());
                case "image":
                    return saveFileMinio.saveFile(file, minioConfig.getImagesBucket());
            }
        }catch (Exception e){
            log.error("Error while creating file", e);
            throw new RuntimeException("Error while creating file", e);
        }
        return null;
    }

    @Override
    @PreAuthorize("hasRole('ARTIST')")
    public AlbumResponse createAlbum(AlbumCreationRequest postRequest) {
        String accountId = SecurityUtils.getCurrentAccountId();
        try {
            Post post = Post.builder()
                    .id(UUID.randomUUID().toString())
                    .accountId(accountId)
                    .createdAt(Instant.now())
                    .updatedAt(null)
                    .likeCount(0)
                    .type(Type.ALBUM)
                    .content(Content.builder()
                            .tags(postRequest.getTags())
                            .title(postRequest.getTitle())
                            .imageUrl(postRequest.getImage())
                            .coverUrl(postRequest.getCover())
                            .songIds(postRequest.getSongIds())
                            .build())
                    .commentCount(0)
                    .viewCount(0)
                    .isPublic(postRequest.getIsPublic())
                    .scheduledAt(postRequest.getSheduleAt())
                    .build();
            postRepository.save(post);
            return AlbumResponse.builder()
                    .id(post.getId())
                    .title(post.getContent().getTitle())
                    .imageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()))
                    .coverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()))
                    .tracks(post.getContent().getSongIds() != null ? post.getContent().getSongIds().size() : 0)
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt() != null ? post.getUpdatedAt() : null)
                    .tags(post.getContent().getTags())
                    .isPublic(post.isPublic())
                    .accountId(post.getAccountId())
                    .viewCount(post.getViewCount())
                    .likeCount(post.getLikeCount())
                    .isLiked(false)
                    .commentCount(post.getCommentCount())
                    .scheduledAt(post.getScheduledAt() != null ? post.getScheduledAt() : null)
                    .build();
        }catch (Exception e){
            log.error("Error while creating album", e);
            throw new RuntimeException("Error while creating album", e);
        }
    }

    @Override
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    public PostResponse createPlaylist(PlaylistCreationRequest postRequest) {
        String accountId = SecurityUtils.getCurrentAccountId();
        try {
            Post post = Post.builder()
                    .id(UUID.randomUUID().toString())
                    .accountId(accountId)
                    .createdAt(Instant.now())
                    .updatedAt(null)
                    .likeCount(0)
                    .type(Type.PLAYLIST)
                    .content(Content.builder()
                            .tags(postRequest.getTags())
                            .title(postRequest.getTitle())
                            .imageUrl(postRequest.getImage())
                            .coverUrl(postRequest.getCover())
                            .build())
                    .commentCount(0)
                    .viewCount(0)
                    .isPublic(postRequest.getIsPublic())
                    .build();
            postRepository.save(post);
            PostResponse postResponse = postMapper.toPostResponse(post);
            ContentResponse content = postResponse.getContent();
            content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
            content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
            postResponse.setContent(content);
            postResponse.set_liked(false);
            return postResponse;
        }catch (Exception e){
            log.error("Error while creating playlist", e);
            throw new RuntimeException("Error while creating playlist", e);
        }
    }

    @Override
    public List<CommentResponse> getComments(String postId) {
        List<Comment> comments = commentRepository.findAllByPostId(postId);
        CommentManager manager = new CommentManager();
        for(Comment comment : comments){
            String parentId = comment.getParentId();
            manager.addDepartment(comment.getId(), comment.getAccountId(), parentId, comment.getContent(), comment.getCreatedAt(), comment.getUpdatedAt(),comment.isUserIsArtist());
        }

        return manager.getAllDepartments();
    }

    @Override
    public PostResponse updatePostText(String postId, EditText postRequest) {
        Post post = postRepository.findById(postId);
        if(post.getType() != Type.TEXT){
            // TODO: change to app exception definition
            throw new RuntimeException("Post is not a text");
        }
        post.setUpdatedAt(Instant.now());
        post.setCaption(postRequest.getCaption());
        post.setPublic(postRequest.getIsPublic());
        postRepository.save(post);
        PostResponse postResponse = postMapper.toPostResponse(post);
        postResponse.set_liked(likeRepository.existsByAccountIdAndPostId(post.getAccountId(), post.getId()));
        return postResponse;
    }

    public List<PostResponse> processPosts(List<Post> posts, String accountId) {
        if (posts.isEmpty()) {
            return Collections.emptyList();
        }

        List<PostResponse> postResponses = new ArrayList<>();

        Set<String> likedPostIdSet = new HashSet<>();
//        if (accountId != null) {
//            List<String> postIds = posts.stream()
//                    .map(Post::getId)
//                    .collect(Collectors.toList());

//            List<String> likedPostIdProjections = likeRepository.findLikedPostIdsByAccountIdAndPostIds(accountId, postIds);
//            likedPostIdSet = likedPostIdProjections.stream()
//                    .collect(Collectors.toSet());
//        }

        for (Post post : posts) {
            PostResponse postResponse = postMapper.toPostResponse(post);
            // Đặt isLiked = false nếu accountId null, ngược lại kiểm tra likedPostIdSet
            postResponse.set_liked(accountId != null && likedPostIdSet.contains(post.getId()));

            if (post.getContent() != null) {
                ContentResponse content = postResponse.getContent();
                if (post.getContent().getImageUrl() != null) {
                    content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
                }
                if (post.getContent().getCoverUrl() != null) {
                    content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
                }
                postResponse.setContent(content);
                if (post.getType() == Type.ALBUM || post.getType() == Type.PLAYLIST) {
                    if (post.getContent().getSongIds() != null) postResponse.getContent().setSongIds(getSongs(post.getContent().getSongIds()));
                }
            }

            postResponses.add(postResponse);
        }

        return postResponses;
    }
}
