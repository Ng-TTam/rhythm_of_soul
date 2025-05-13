package com.rhythm_of_soul.content_service.dto;

import lombok.Getter;
import lombok.Setter;

//using to map list postId when get data in db -> due auto mapping object
@Getter
@Setter
public class PostIdProjection {
    private String postId;
}
