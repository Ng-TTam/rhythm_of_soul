package com.rhythm_of_soul.controller.http;

import com.rhythm_of_soul.application.model.request.*;
import com.rhythm_of_soul.application.model.response.*;
import com.rhythm_of_soul.application.service.post.PostService;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.response.ApiResponse;
import com.rhythm_of_soul.infrastructure.utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;

    @PostMapping("/uploadFile")
    ApiResponse<String> uploadFile(@RequestParam("file") MultipartFile file,
                                   @RequestParam("type") String type) {
        return ApiResponse.<String>builder()
                .message("File uploaded successfully")
                .result(postService.createFile(file, type))
                .build();
    }

    @PostMapping
    ApiResponse<PostResponse> createPost(@Valid @RequestBody PostRequest postRequest) {
        String accountId = SecurityUtils.getCurrentAccountId();
        log.info("Creating post for accountId: {}", accountId);
        return ApiResponse.<PostResponse>builder()
                .message("Post created successfully")
                .result(postService.createPost(accountId, postRequest))
                .build();
    }

    @PutMapping("/{postId}")
    ApiResponse<PostResponse> updatePost(@PathVariable String postId,
                                         @RequestBody PostRequest postRequest) {
        return ApiResponse.<PostResponse>builder()
                .message("Post updated successfully")
                .result(postService.updatePost(postId, postRequest))
                .build();
    }

    @GetMapping("/{accountId}/album")
    ApiResponse<List<AlbumResponse>> getAlbum(@PathVariable String accountId) {
        return ApiResponse.<List<AlbumResponse>>builder()
                .message("Album retrieved successfully")
                .result(postService.getAlbum(accountId))
                .build();
    }

    @GetMapping("/playlist/{accountId}")
    ApiResponse<List<BasicPlaylistResponse>> getPlaylist(@PathVariable String accountId, @RequestParam("songId") String songId) {
        return ApiResponse.<List<BasicPlaylistResponse>>builder()
                .message("Playlist retrieved successfully")
                .result(postService.getBasicPlaylists(accountId, songId))
                .build();
    }

    @PutMapping("/{postId}/add-song")
    ApiResponse<PostResponse> addSongs(@PathVariable String postId, @RequestParam("songId") String songId) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.addSong(postId, songId))
                .build();
    }

    @GetMapping("/{accountId}")
    ApiResponse<List<PostResponse>> getPosts(@PathVariable String accountId) {
        return ApiResponse.<List<PostResponse>>builder()
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
    ApiResponse<PostDetailResponse> getPostDetail(@PathVariable String postId) {
        String accountId = SecurityUtils.getCurrentAccountId();
        return ApiResponse.<PostDetailResponse>builder()
                .result(postService.getPostDetail(accountId, postId))
                .build();
    }

    @GetMapping("/{postId}/comments")
    ApiResponse<List<CommentResponse>> getComments(@PathVariable String postId) {
        return ApiResponse.<List<CommentResponse>>builder()
                .result(postService.getComments(postId))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<List<PostResponse>> searchPosts(
            @RequestParam(required = false) String accountId,
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

    @GetMapping("/songs/recently")
    public ApiResponse<List<PostResponse>> getSongPostsListened(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String accountId = SecurityUtils.getCurrentAccountId();
        if (accountId == null) {
            return ApiResponse.<List<PostResponse>>builder()
                    .result(List.of())
                    .build();
        }
        return ApiResponse.<List<PostResponse>>builder()
                .message("Get history listened successfully")
                .build();
    }

    @GetMapping("/top/songs/weekly")
    public ApiResponse<List<PostResponse>> getTopSongPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<List<PostResponse>>builder()
                .message("Top songs in weekly")
                .build();
    }

    @PostMapping("/listen")
    public ApiResponse<Void> recordListen(
            @RequestParam String sessionId,
            @RequestParam String postId) {
        return ApiResponse.<Void>builder().build();
    }

    @GetMapping("/{postId}/post")
    ApiResponse<PostResponse> getPost(@PathVariable String postId) {
        return ApiResponse.<PostResponse>builder()
                .result(postService.getPost(postId))
                .build();
    }

    @GetMapping("/songs")
    ApiResponse<List<SongResponse>> getListSongs() {
        return ApiResponse.<List<SongResponse>>builder()
                .build();
    }
}
