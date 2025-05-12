package com.rhythm_of_soul.content_service.controller;

import com.rhythm_of_soul.content_service.common.Tag;
import com.rhythm_of_soul.content_service.dto.ApiResponse;
import com.rhythm_of_soul.content_service.dto.PostResponse;
import com.rhythm_of_soul.content_service.dto.response.AlbumResponse;
import com.rhythm_of_soul.content_service.dto.response.PlaylistResponse;
import com.rhythm_of_soul.content_service.dto.response.PostDetailResponse;
import com.rhythm_of_soul.content_service.dto.resquest.PostRequest;
import com.rhythm_of_soul.content_service.service.PostService;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;
    @PostMapping("/upload")
    ApiResponse<PostResponse> uploadFile(@RequestParam("song") MultipartFile song ,
                                        @RequestParam("image") MultipartFile image ,
                                        @RequestParam("cover") MultipartFile cover,
                                        @RequestParam("tags") List<Tag> tags,
                                        @RequestParam("title") String title,
                                        @RequestParam(name = "caption" , required = false ) String caption,
                                        @RequestParam("isPublic") String isPublic,
                                        @RequestParam ("user_id") String user_id) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        return ApiResponse.<PostResponse>builder()
                .message("File uploaded successfully")
                .result(postService.storeFile(song,cover,image, user_id, tags, title, caption, isPublic))
                .build();
    }
    @PostMapping
    ApiResponse<PostResponse> createPost(@RequestBody PostRequest postRequest) {
        return ApiResponse.<PostResponse>builder()
                .message("Post created successfully")
                .result(postService.createPost(postRequest))
                .build();

    }
    @GetMapping("/{userId}/album")
    ApiResponse<List<AlbumResponse>> getAlbum(@PathVariable String userId) {
        return ApiResponse.<List<AlbumResponse>>builder()
                .message("Album created successfully")
                .result(postService.getAlbum(userId))
                .build();
    }
    @PutMapping("/{postId}")
    ApiResponse<PostResponse> addSongs(@PathVariable String postId, @RequestParam List<String> songIds) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.addSong(postId, songIds))
                .build();
    }
    @GetMapping("/{userId}")
    ApiResponse<List<PostResponse>> getPosts(@PathVariable String userId) {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getPosts(userId))
                .build();
    }
    @GetMapping("/{userId}/songs")
    ApiResponse<List<PostResponse>> getSongs(@PathVariable String userId) {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getSongs(userId))
                .build();
    }
    @GetMapping("/{userId}/playlists")
    ApiResponse<List<PostResponse>> getPlaylists(@PathVariable String userId) {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getPlaylists(userId))
                .build();
    }

    @GetMapping("/detailPost/{postId}")
    ApiResponse<PostDetailResponse> getPost(@PathVariable String postId) {
        return ApiResponse.<PostDetailResponse>builder()
                .result(postService.getPost(postId))
                .build();
    }
}
