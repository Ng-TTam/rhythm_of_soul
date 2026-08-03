package com.rhythm_of_soul.domain.model.request;

import com.rhythm_of_soul.domain.model.enums.Tag;

import java.util.List;

public class EditPlaylist {
    private String title;
    private String coverUrl;
    private String imageUrl;
    private Boolean isPublic;
    private List<String> songIds;
    private List<Tag> tags;
    private String caption;
}
