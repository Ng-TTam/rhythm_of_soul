package com.rhythm_of_soul.domain.model.entity;

import com.rhythm_of_soul.domain.model.enums.Tag;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class Content {
    private String title;
    private String mediaUrl;
    private List<String> songIds;
    private String originalPostId;
    private List<Tag> tags;
    private  String imageUrl;
    private  String coverUrl;
}