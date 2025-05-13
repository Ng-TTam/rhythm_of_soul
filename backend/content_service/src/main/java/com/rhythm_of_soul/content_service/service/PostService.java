package com.rhythm_of_soul.content_service.service;

import com.rhythm_of_soul.content_service.common.Tag;
import com.rhythm_of_soul.content_service.dto.PostResponse;
import com.rhythm_of_soul.content_service.dto.response.AlbumResponse;
import com.rhythm_of_soul.content_service.dto.response.PlaylistResponse;
import com.rhythm_of_soul.content_service.dto.response.PostDetailResponse;
import com.rhythm_of_soul.content_service.dto.request.PostRequest;
import io.minio.errors.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

public interface PostService {
    PostResponse storeFile(MultipartFile song, MultipartFile cover , MultipartFile image , String user_id, List<Tag> tags,String title, String caption,String isPublic)
            throws IOException, ServerException, InsufficientDataException,
            ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException,
            InvalidResponseException, XmlParserException, InternalException;
    PostResponse createPost(PostRequest postRequest);
    PostResponse addSong(String postId, List<String> songIds);
    List<PostResponse> getPosts(String accountId);
    PostDetailResponse getPost(String postId);
    List<PostResponse> getSongs(String accountId);
    List<PostResponse> getPlaylists(String accountId);
    List<AlbumResponse> getAlbum(String accountId);
}
