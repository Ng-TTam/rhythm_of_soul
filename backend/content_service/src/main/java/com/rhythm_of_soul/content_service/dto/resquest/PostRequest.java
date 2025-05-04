package com.rhythm_of_soul.content_service.dto.resquest;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.rhythm_of_soul.content_service.common.Type;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)

public class PostRequest {
    String user_id;
    Type type;
    String caption;
    Boolean isPublic;
    ContentRequest content;
}
