package com.rhythm_of_soul.content_service.service;

import com.rhythm_of_soul.content_service.dto.PostResponse;

import java.util.List;

public interface ListeningHistoryService {
    /**
     * get list song post listened of account
     *
     * @param accountId account listened song, account id in token
     * @param page page
     * @param size size of page
     * @return list post user listened
     */
    List<PostResponse> getSongPostsListened(String accountId, int page, int size);

    /**
     * get top song post in weekly
     *
     * @param page page
     * @param size size of page
     * @return list top song
     */
    List<PostResponse> getTopSongPosts(int page, int size);

    /**
     * mark listen song in post
     *
     * @param accountId null if guess and not null is user have account
     * @param sessionId client create sessionId
     * @param postId post contain song
     */
    void recordListen(String accountId, String sessionId, String postId);
}
