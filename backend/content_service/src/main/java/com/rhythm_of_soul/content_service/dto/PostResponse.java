package com.rhythm_of_soul.content_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostResponse {
    String id;
    String account_id;
    String type;
    String caption;
    ContentResponse content;
    int view_count;
    int like_count;
    int comment_count;
    boolean is_public;
    Instant created_at;
    Instant updated_at;
    Instant scheduled_at;
    boolean is_liked;
}
