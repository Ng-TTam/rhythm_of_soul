package com.rhythm_of_soul.domain.model.request;

import com.rhythm_of_soul.domain.model.enums.Type;

public class PostRequest {
    private Type type;
    private String caption;
    private Boolean isPublic;
    private ContentRequest content;
}
