package com.rhythm_of_soul.content_service.service.Impl;

import com.rhythm_of_soul.content_service.common.Tag;
import com.rhythm_of_soul.content_service.common.Type;
import com.rhythm_of_soul.content_service.config.MinioConfig;
import com.rhythm_of_soul.content_service.dto.ContentResponse;
import com.rhythm_of_soul.content_service.dto.PostResponse;
import com.rhythm_of_soul.content_service.dto.response.CommentResponse;
import com.rhythm_of_soul.content_service.dto.response.PlaylistResponse;
import com.rhythm_of_soul.content_service.dto.response.PostDetailResponse;
import com.rhythm_of_soul.content_service.dto.resquest.PostRequest;
import com.rhythm_of_soul.content_service.dto.response.SongResponse;
import com.rhythm_of_soul.content_service.entity.Comment;
import com.rhythm_of_soul.content_service.entity.Like;
import com.rhythm_of_soul.content_service.entity.Post;
import com.rhythm_of_soul.content_service.entity.Post.Content;
import com.rhythm_of_soul.content_service.mapper.LikeMapper;
import com.rhythm_of_soul.content_service.mapper.PostMapper;
import com.rhythm_of_soul.content_service.repository.CommentRepository;
import com.rhythm_of_soul.content_service.repository.LikeRepository;
import com.rhythm_of_soul.content_service.repository.PostRepository;
import com.rhythm_of_soul.content_service.service.PostService;
import com.rhythm_of_soul.content_service.utils.CommentManager;
import com.rhythm_of_soul.content_service.utils.SaveFileMinio;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

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

    @Override
    public PostResponse storeFile(MultipartFile song, MultipartFile cover , MultipartFile image, String user_id, List<Tag> tags, String title,String caption,String isPublic) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
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
                .userId(user_id)
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
        return postResponse;
    }

    @Override
    @Transactional
    public PostResponse createPost(PostRequest postRequest) {
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
                postResponse.getContent().setSongIds(getSongs(postRequest.getContent().getSongIds()));

            }
            return postResponse;
        }catch (Exception e){
            log.error("Error while creating post", e);
            throw new RuntimeException("Error while creating post", e);
        }



    }

    @Override
    public PostResponse addSong(String postId, List<String> songIds) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        List<String> songList = post.getContent().getSongIds();
        for(String songId : songIds){
            if(!songList.contains(songId)){
                songList.add(songId);
            }
        }

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
            Post songPost = postRepository.findById(songId).orElseThrow(() -> new RuntimeException("Song not found"));
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
    public List<PostResponse> getPosts(String userId) {
        List<Post> posts = postRepository.findAllByUserId(userId);
        List<PostResponse> postResponses = new ArrayList<>();
        for(Post post : posts){
            PostResponse postResponse = postMapper.toPostResponse(post);
            if(post.getContent() != null){
                ContentResponse content = postResponse.getContent();
                if(post.getContent().getImageUrl() != null) content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
                if(post.getContent().getCoverUrl() != null)  content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
                postResponse.setContent(content);
                if(post.getType() == Type.ALBUM || post.getType() == Type.PLAYLIST){
                    postResponse.getContent().setSongIds(getSongs(post.getContent().getSongIds()));
                }
            }

            postResponses.add(postResponse);

        }
        return postResponses;
    }

    @Override
    public PostDetailResponse getPost(String postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        PostResponse postResponse = postMapper.toPostResponse(post);
        if(post.getContent() != null){
            ContentResponse content = postResponse.getContent();
            if (post.getContent().getImageUrl() != null) content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
            if (post.getContent().getCoverUrl() != null) content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
            if(post.getType() == Type.ALBUM || post.getType() == Type.PLAYLIST){
                content.setSongIds(getSongs(post.getContent().getSongIds()));
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
    public List<PostResponse> getSongs(String userId) {
        List<Post> posts = postRepository.findAllByUserIdAndType(userId, Type.SONG);
        List<PostResponse> postResponses = new ArrayList<>();
        for(Post post : posts){
            PostResponse postResponse = postMapper.toPostResponse(post);
            if(post.getContent() != null){
                ContentResponse content = postResponse.getContent();
                if(post.getContent().getImageUrl() != null) content.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()));
                if(post.getContent().getCoverUrl() != null)  content.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), post.getContent().getCoverUrl()));
                postResponse.setContent(content);
            }
            postResponses.add(postResponse);

        }
        return postResponses;
    }

    @Override
    public List<PlaylistResponse> getPlaylists(String userId) {
        List<Post> posts = postRepository.findAllByUserIdAndType(userId, Type.PLAYLIST);
        List<PlaylistResponse> playlistResponses = new ArrayList<>();
        for(Post post : posts){
            playlistResponses.add(PlaylistResponse.builder()
                    .id(post.getId())
                    .title(post.getContent().getTitle())
                    .imageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), post.getContent().getImageUrl()))
                    .tracks(post.getContent().getSongIds().size())
                            .tags(post.getContent().getTags())
                    .build());
        }
        return playlistResponses;
    }

    private List<CommentResponse> getComments(String postId) {
        List<Comment> comments = commentRepository.findAllByPostId(postId);
        CommentManager manager = new CommentManager();
        for(Comment comment : comments){
            String parentId = comment.getParentId();
            manager.addDepartment(comment.getId(), comment.getUserId(), parentId, comment.getContent(), Date.from(comment.getCreatedAt()));
        }

        return manager.getAllDepartments();
    }

}
