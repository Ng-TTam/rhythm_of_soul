package com.rhythm_of_soul.application.service.post.impl;

import com.rhythm_of_soul.application.model.request.*;
import com.rhythm_of_soul.application.model.response.*;
import com.rhythm_of_soul.application.service.post.PostService;
import com.rhythm_of_soul.domain.model.enums.Tag;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.repository.PostRepository;
import io.minio.errors.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.rmi.ServerException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Slf4j
@Service
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;

    PostServiceImpl(PostRepository postRepository){
        this.postRepository = postRepository;
    }

    @Override
    public PostResponse storeFile(MultipartFile song, MultipartFile cover, MultipartFile image, String account_id, List<Tag> tags, String title, String caption, String isPublic) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        return null;
    }

    @Override
    public PostResponse createPost(String accountId, PostRequest postRequest) {
        return null;
    }

    @Override
    public PostResponse addSong(String postId, String songIds) {
        return null;
    }

    @Override
    public List<PostResponse> getPosts(String accountId) {
        return List.of();
    }

    @Override
    public List<PostResponse> getSongs(String accountId) {
        return List.of();
    }

    @Override
    public List<PostResponse> getPlaylists(String accountId) {
        return List.of();
    }

    @Override
    public List<AlbumResponse> getAlbum(String accountId) {
        return List.of();
    }

    @Override
    public List<BasicPlaylistResponse> getBasicPlaylists(String accountId, String songId) {
        return List.of();
    }

    @Override
    public PostResponse updateSong(String songId, EditPostSong postRequest) {
        return null;
    }

    @Override
    public AlbumResponse updateAlbum(String albumId, EditAlbum postRequest) {
        return null;
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
        return null;
    }

    @Override
    public PostResponse getPost(String postId) {
        return null;
    }

    @Override
    public List<SongResponse> getListSongs() {
        return List.of();
    }

    @Override
    public String createFile(MultipartFile file, String type) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        return "";
    }

    @Override
    public AlbumResponse createAlbum(AlbumCreationRequest postRequest) {
        return null;
    }

    @Override
    public PostResponse createPlaylist(PlaylistCreationRequest postRequest) {
        return null;
    }

    @Override
    public List<CommentResponse> getComments(String postId) {
        return List.of();
    }

    @Override
    public PostResponse updatePostText(String postId, EditText postRequest) {
        return null;
    }
}
