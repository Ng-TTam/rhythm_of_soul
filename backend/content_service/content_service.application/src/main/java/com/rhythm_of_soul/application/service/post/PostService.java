package com.rhythm_of_soul.application.service.post;

import com.rhythm_of_soul.application.model.request.*;
import com.rhythm_of_soul.application.model.response.*;
import com.rhythm_of_soul.domain.model.enums.Tag;
import com.rhythm_of_soul.domain.model.enums.Type;
import io.minio.errors.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

public interface PostService {
    PostResponse storeFile(MultipartFile song, MultipartFile cover , MultipartFile image , String account_id, List<Tag> tags, String title, String caption, String isPublic)
            throws IOException, ServerException, InsufficientDataException,
            ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException,
            InvalidResponseException, XmlParserException, InternalException;
    PostResponse createPost(String accountId, PostRequest postRequest);
    PostResponse updatePost(String postId, PostRequest postRequest);
    PostResponse addSong(String postId, String songIds);

    List<PostResponse> getSongs(String accountId);
    List<PostResponse> getPlaylists(String accountId);
    List<AlbumResponse> getAlbum(String accountId);
    List<BasicPlaylistResponse> getBasicPlaylists(String accountId, String songId);
    /**
     * Search post with key
     * if type = TEXT -> find caption
     * if type != TEXT -> find title of song/album/playlist
     *
     * @param accountId id of account get post to mark is_like in post response/if guess search -> accountId = null
     * @param keyword for search
     * @param tag tag need to search
     * @param type TEXT, SONG, AlBUM, PLAYLIST
     * @param page page current
     * @param size post quantity in 1 page
     * @return list post
     */
    List<PostResponse> searchPosts(String accountId, String keyword, String tag, Type type, int page, int size);
    PostDetailResponse getPostDetail(String accountId, String postId);
    PostResponse getPost(String postId);
    List<SongResponse> getListSongs(Pageable pageable);
    String createFile(MultipartFile file, String type)
            throws IOException, ServerException, InsufficientDataException,
            ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException,
            InvalidResponseException, XmlParserException, InternalException;
    List<CommentResponse> getComments(String postId);
}
