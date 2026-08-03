package com.rhythm_of_soul.domain.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostResponse {
    private String id;
    private String account_id;
    private String type;
    private String caption;
    private ContentResponse content;
    private int view_count;
    private int like_count;
    private int comment_count;
    private boolean is_public;
    private Instant created_at;
    private Instant updated_at;
    private Instant scheduled_at;
    private boolean is_liked;
    
}
