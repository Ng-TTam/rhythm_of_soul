package com.rhythm_of_soul.domain.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rhythm_of_soul.domain.model.enums.Tag;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SongResponse {
    private String title;
    private String mediaUrl;
    private String imageUrl;
    private String coverUrl;
    private String songId;
    private List<Tag> tags;

}
