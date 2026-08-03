package com.rhythm_of_soul.domain.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rhythm_of_soul.domain.model.enums.Tag;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlaylistResponse {
    private String id;
    private String title;
    private String imageUrl;
    private Boolean isLiked;
    private List<Tag> tags;
    private int tracks;
}
