package com.rhythm_of_soul.content_service.service.Impl;

import com.rhythm_of_soul.content_service.common.Tag;
import com.rhythm_of_soul.content_service.common.Type;
import com.rhythm_of_soul.content_service.config.MinioConfig;
import com.rhythm_of_soul.content_service.dto.ContentResponse;
import com.rhythm_of_soul.content_service.dto.PostResponse;
import com.rhythm_of_soul.content_service.dto.request.*;
import com.rhythm_of_soul.content_service.dto.response.AlbumResponse;
import com.rhythm_of_soul.content_service.dto.response.BasicPlaylistResponse;
import com.rhythm_of_soul.content_service.dto.response.CommentResponse;
import com.rhythm_of_soul.content_service.dto.response.PostDetailResponse;
import com.rhythm_of_soul.content_service.dto.response.SongResponse;
import com.rhythm_of_soul.content_service.entity.Comment;
import com.rhythm_of_soul.content_service.entity.Like;
import com.rhythm_of_soul.content_service.entity.Post;
import com.rhythm_of_soul.content_service.entity.Post.Content;
import com.rhythm_of_soul.content_service.exception.AppException;
import com.rhythm_of_soul.content_service.exception.ErrorCode;
import com.rhythm_of_soul.content_service.mapper.LikeMapper;
import com.rhythm_of_soul.content_service.mapper.PostMapper;
import com.rhythm_of_soul.content_service.repository.CommentRepository;
import com.rhythm_of_soul.content_service.repository.LikeRepository;
import com.rhythm_of_soul.content_service.repository.PostRepository;
import com.rhythm_of_soul.content_service.service.IdentityClient;
import com.rhythm_of_soul.content_service.service.PostService;
import com.rhythm_of_soul.content_service.service.RedisPublisher;
import com.rhythm_of_soul.content_service.utils.CommentManager;
import com.rhythm_of_soul.content_service.utils.SaveFileMinio;
import com.rhythm_of_soul.content_service.utils.SecurityUtils;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class PostServiceImpl implements  PostService {

    PostRepository postRepository;
    CommentRepository commentRepository;
    LikeRepository likeRepository;
    PostMapper postMapper;
    LikeMapper likeMapper;
    SaveFileMinio saveFileMinio;
    MinioConfig minioConfig;
    MongoTemplate mongoTemplate;
    IdentityClient identityClient;
    RedisPublisher redisPublisher;

    @Override
    public PostResponse storeFile(MultipartFile song, MultipartFile cover , MultipartFile image, String account_id, List<Tag> tags, String title,String caption,String isPublic) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        String songUrl = saveFileMinio.saveFile(song, minioConfig.getSongsBucket());
        String coverUrl = saveFileMinio.saveFile(cover, minioConfig.getCoversBucket());
        String imageUrl = saveFileMinio.saveFile(image, minioConfig.getImagesBucket());
        Content content = Content.builder()
                .tags(tags)
                .title(title)
                .mediaUrl(songUrl)
                .coverUrl(coverUrl)
                .imageUrl(imageUrl)
                .build();
        Post post = Post.builder()
                .id(UUID.randomUUID().toString())
                .accountId(account_id)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .likeCount(0)
                .type(Type.SONG)
                .content(content)
                .commentCount(0)
                .viewCount(0)
                .isPublic(isPublic == "true")
                .caption(caption)
                .build();
        postRepository.save(post);
        PostResponse postResponse = postMapper.toPostResponse(post);
        ContentResponse contentResponse = postResponse.getContent();
        contentResponse.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
        contentResponse.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
        postResponse.setContent(contentResponse);
        postResponse.set_liked(false);
        return postResponse;
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
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
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
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
            Post songPost = postRepository.findById(songId).orElseThrow(() -> new AppException(ErrorCode.SONG_NOT_FOUND));
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
    public List<PostResponse> getPosts(String accountId) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Post> posts = postRepository.findAllByAccountId(accountId, pageable);
        return processPosts(posts, accountId);
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
    public List<PostResponse> searchPosts(String accountId, String keyword, String tag, Type type, int page, int size) {
        // Chuẩn hóa tham số
        String normalizedKeyword = null;

        if (keyword != null) {
            normalizedKeyword = keyword
                    .replace("+", " ")
                    .trim()
                    .replaceAll("[^a-zA-Z0-9\\s]", "")
                    .replaceAll("\\s{2,}", " ");
        }
        String normalizedTag = tag != null ? tag.trim().toLowerCase() : null;

        if (page < 0 || size <= 0) {
            return Collections.emptyList();
        }
        long skip = (long) page * size;

        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (type != null) {
            criteriaList.add(Criteria.where("type").is(type));
        }

        // Điều kiện keyword
        if (normalizedKeyword != null && !normalizedKeyword.isEmpty()) {
            List<Criteria> keywordCriteria = new ArrayList<>();
            if (type == null || type == Type.TEXT) {
                keywordCriteria.add(Criteria.where("type").is(Type.TEXT)
                        .and("caption").regex(normalizedKeyword, "i"));
            }
            if (type == null || List.of(Type.SONG, Type.ALBUM, Type.PLAYLIST).contains(type)) {
                keywordCriteria.add(Criteria.where("type").in(Type.SONG, Type.ALBUM, Type.PLAYLIST)
                        .and("content.title").regex(normalizedKeyword, "i"));
            }
            if (!keywordCriteria.isEmpty()) {
                criteriaList.add(new Criteria().orOperator(keywordCriteria));
            }
        }

        if (normalizedTag != null && !normalizedTag.isEmpty()) {
            criteriaList.add(Criteria.where("content.tags").in(normalizedTag));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList));
        }

        query.skip(skip).limit(size);
        List<Post> posts = mongoTemplate.find(query, Post.class);

        return processPosts(posts, accountId);
    }

    @Override
    public PostResponse updatePlaylist(String playlistId, EditPlaylist postRequest) {
        Post post = postRepository.findById(playlistId).orElseThrow(() -> new RuntimeException("Post not found"));
        if(post.getType() != Type.PLAYLIST){
            throw new RuntimeException("Post is not a playlist");
        }
        post.setUpdatedAt(Instant.now());
        post.setPublic(postRequest.getIsPublic());
        post.setCaption(postRequest.getCaption());
        Content content = post.getContent();
        content.setTitle(postRequest.getTitle());
        if(!postRequest.getImageUrl().contains("http://localhost:9000")) content.setImageUrl(postRequest.getImageUrl());
        if(!postRequest.getCoverUrl().contains("http://localhost:9000")) content.setCoverUrl(postRequest.getCoverUrl());
        content.setTags(postRequest.getTags());
        content.setSongIds(postRequest.getSongIds());
        post.setContent(content);
        postRepository.save(post);
        PostResponse postResponse = postMapper.toPostResponse(post);
        ContentResponse contentResponse = postResponse.getContent();
        contentResponse.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
        contentResponse.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
        postResponse.setContent(contentResponse);
        postResponse.set_liked(likeRepository.existsByAccountIdAndPostId(SecurityUtils.getCurrentAccountId(), post.getId()));
        return postResponse;

    }

    @Override
    public PostDetailResponse getPostDetail(String accountId, String postId) {
        Post post = postRepository.findById(postId).orElseThrow(
                () -> new AppException(ErrorCode.POST_NOT_FOUND));
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

        List <Like> likes = likeRepository.findAllByPostId(postId);
        return PostDetailResponse.builder()
                .post(postResponse)
                .likes(likes.stream().map(likeMapper::toLikeResponse).toList())
                .comments(getComments(postId))
                .build();
    }

    @Override
    public PostResponse getPost(String postId) {
        Post post = postRepository.findById(postId).orElseThrow(
                () -> new AppException(ErrorCode.POST_NOT_FOUND));
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
    public List<SongResponse> getListSongs() {
        List<Post> posts = postRepository.findAllByType(Type.SONG);
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

    public List<PostResponse> processPosts(List<Post> posts, String accountId) {
        if (posts.isEmpty()) {
            return Collections.emptyList();
        }

        List<PostResponse> postResponses = new ArrayList<>();

        // Chỉ kiểm tra trạng thái like nếu accountId không null
        Set<String> likedPostIdSet = new HashSet<>();
        if (accountId != null) {
            List<String> postIds = posts.stream()
                    .map(Post::getId)
                    .collect(Collectors.toList());

            List<LikeRepository.PostIdProjection> likedPostIdProjections = likeRepository.findLikedPostIdsByAccountIdAndPostIds(accountId, postIds);
            likedPostIdSet = likedPostIdProjections.stream()
                    .map(LikeRepository.PostIdProjection::getPostId)
                    .collect(Collectors.toSet());
        }

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

//    public Page<Post> searchPostsWithAggregation(String keyword, String tag, Type type, Pageable pageable) {
//        List<AggregationOperation> operations = new ArrayList<>();
//
//        List<Criteria> criteriaList = new ArrayList<>();
//        if (type != null) {
//            criteriaList.add(Criteria.where("type").is(type));
//        }
//        if (keyword != null && !keyword.isEmpty()) {
//            String normalizedKeyword = keyword.trim().replaceAll("[^a-zA-Z0-9\\s]", "");
//            List<Criteria> keywordCriteria = new ArrayList<>();
//            if (type == null || type == Type.TEXT) {
//                keywordCriteria.add(Criteria.where("type").is(Type.TEXT)
//                        .and("content.caption").regex(normalizedKeyword, "i"));
//            }
//            if (type == null || List.of(Type.SONG, Type.ALBUM, Type.PLAYLIST).contains(type)) {
//                keywordCriteria.add(Criteria.where("type").in(Type.SONG, Type.ALBUM, Type.PLAYLIST)
//                        .and("content.title").regex(normalizedKeyword, "i"));
//            }
//            if (!keywordCriteria.isEmpty()) {
//                criteriaList.add(new Criteria().orOperator(keywordCriteria));
//            }
//        }
//        if (tag != null && !tag.isEmpty()) {
//            criteriaList.add(Criteria.where("content.tags").in(tag.trim().toLowerCase()));
//        }
//
//        if (!criteriaList.isEmpty()) {
//            operations.add(Aggregation.match(new Criteria().andOperator(criteriaList)));
//        }
//
//        operations.add(Aggregation.skip(pageable.getOffset()));
//        operations.add(Aggregation.limit(pageable.getPageSize()));
//
//        Aggregation aggregation = Aggregation.newAggregation(operations);
//        AggregationResults<Post> results = mongoTemplate.aggregate(aggregation, Post.class, Post.class);
//
//        long total = mongoTemplate.count(new Query(criteriaList.isEmpty() ? new Criteria() : new Criteria().andOperator(criteriaList)), Post.class);
//        return new PageImpl<>(results.getMappedResults(), pageable, total);
//    }

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
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        if(post.getType() != Type.TEXT){
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
        Post post = postRepository.findById(songId).orElseThrow(() -> new RuntimeException("Post not found"));
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
        Post post = postRepository.findById(albumId).orElseThrow(() -> new RuntimeException("Post not found"));
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

}