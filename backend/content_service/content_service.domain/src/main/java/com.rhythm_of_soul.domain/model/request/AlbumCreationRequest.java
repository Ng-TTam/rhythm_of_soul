package com.rhythm_of_soul.domain.model.request;

import com.rhythm_of_soul.domain.model.enums.Tag;

import java.time.Instant;
import java.util.List;


public class AlbumCreationRequest {
    private String title;
    private String image;
    private String cover;
    private Boolean isPublic;
    private List<Tag> tags;
    private Instant sheduleAt;
    private List<String> songIds;

}
