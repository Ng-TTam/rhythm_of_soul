package com.rhythm_of_soul.domain.model.request;

import com.rhythm_of_soul.domain.model.enums.Tag;

import java.util.List;

public class PlaylistCreationRequest {
    private String title;
    private String image;
    private String cover;
    private Boolean isPublic;
    private List<Tag> tags;
}
