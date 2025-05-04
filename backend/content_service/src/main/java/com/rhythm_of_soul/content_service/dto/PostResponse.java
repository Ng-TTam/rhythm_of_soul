package com.rhythm_of_soul.content_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostResponse {
    String id;
    String user_id;
    String type;
    String caption;
    ContentResponse content;
    int view_count;
    int like_count;
    int comment_count;
    boolean is_public;
    Date created_at;
    Date updated_at;
    Date scheduled_at;
}
