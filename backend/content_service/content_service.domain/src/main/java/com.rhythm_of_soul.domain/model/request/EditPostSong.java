package com.rhythm_of_soul.domain.model.request;

import com.rhythm_of_soul.domain.model.enums.Tag;

import java.util.List;

public class EditPostSong {
    private String title;
    private String coverUrl;
    private String imageUrl;
    private List<Tag> tags;
    private String caption;
    private Boolean  isPublic;
}
