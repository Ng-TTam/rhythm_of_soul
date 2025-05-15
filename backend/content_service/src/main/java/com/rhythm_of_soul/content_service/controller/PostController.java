package com.rhythm_of_soul.content_service.controller;

import com.rhythm_of_soul.content_service.common.Tag;
import com.rhythm_of_soul.content_service.common.Type;
import com.rhythm_of_soul.content_service.dto.ApiResponse;
import com.rhythm_of_soul.content_service.dto.PostResponse;
import com.rhythm_of_soul.content_service.dto.request.PostRequest;
import com.rhythm_of_soul.content_service.dto.response.AlbumResponse;
import com.rhythm_of_soul.content_service.dto.response.PostDetailResponse;
import com.rhythm_of_soul.content_service.service.ListeningHistoryService;
import com.rhythm_of_soul.content_service.service.PostService;
import io.minio.errors.*;
import jakarta.validation.Valid;
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
    private final ListeningHistoryService listeningHistoryService;

    @PostMapping("/upload")
    ApiResponse<PostResponse> uploadFile(@RequestParam("song") MultipartFile song ,
                                        @RequestParam("image") MultipartFile image ,
                                        @RequestParam("cover") MultipartFile cover,
                                        @RequestParam("tags") List<Tag> tags,
                                        @RequestParam("title") String title,
                                        @RequestParam(name = "caption" , required = false ) String caption,
                                        @RequestParam("isPublic") String isPublic,
                                        @RequestParam ("account_id") String account_id) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        return ApiResponse.<PostResponse>builder()
                .message("File uploaded successfully")
                .result(postService.storeFile(song,cover,image, account_id, tags, title, caption, isPublic))
                .build();
    }
    @PostMapping
    ApiResponse<PostResponse> createPost(@Valid @RequestBody PostRequest postRequest) {
        // get accountId in token
//        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<PostResponse>builder()
                .message("Post created successfully")
                .result(postService.createPost("326e6645-aa0f-4f89-b885-019c05b1a970" ,postRequest))
                .build();

    }
    @GetMapping("/{accountId}/album")
    ApiResponse<List<AlbumResponse>> getAlbum(@PathVariable String accountId) {
        return ApiResponse.<List<AlbumResponse>>builder()
                .message("Album created successfully")
                .result(postService.getAlbum(accountId))
                .build();
    }
    @PutMapping("/{postId}")
    ApiResponse<PostResponse> addSongs(@PathVariable String postId, @RequestParam List<String> songIds) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.addSong(postId, songIds))
                .build();
    }
    @GetMapping("/{accountId}")
    ApiResponse<List<PostResponse>> getPosts(@PathVariable String accountId) {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getPosts(accountId))
                .build();
    }
    @GetMapping("/{accountId}/songs")
    ApiResponse<List<PostResponse>> getSongs(@PathVariable String accountId) {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getSongs(accountId))
                .build();
    }
    @GetMapping("/{accountId}/playlists")
    ApiResponse<List<PostResponse>> getPlaylists(@PathVariable String accountId) {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getPlaylists(accountId))
                .build();
    }

    @GetMapping("/detailPost/{postId}")
    ApiResponse<PostDetailResponse> getPost(@PathVariable String postId) {
        // get accountId in token
//        String accountId = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<PostDetailResponse>builder()
                .result(postService.getPost("326e6645-aa0f-4f89-b885-019c05b1a970", postId))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<List<PostResponse>> searchPosts(
            @RequestParam String accountId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) Type type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<List<PostResponse>>builder()
                .message("Search results successfully")
                .result(postService.searchPosts(accountId, keyword, tag, type, page, size))
                .build();
    }

    @GetMapping("/songs/history")
    public ApiResponse<List<PostResponse>> getSongPostsListened(
            @RequestParam(required = false) String accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<List<PostResponse>>builder()
                .message("Get history listened successfully")
                .result(listeningHistoryService.getSongPostsListened(accountId, page, size))
                .build();
    }

    @GetMapping("/top/songs/weekly")
    public ApiResponse<List<PostResponse>> getTopSongPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<List<PostResponse>>builder()
                .message("Top songs in weekly")
                .result(listeningHistoryService.getTopSongPosts(page, size))
                .build();
    }

    @PostMapping("/listen")
    public ApiResponse<Void> recordListen(
            @RequestParam(required = false) String accountId,
            @RequestParam String sessionId,
            @RequestParam String postId) {
        listeningHistoryService.recordListen(accountId, sessionId, postId);
        return ApiResponse.<Void>builder().build();
    }
}
