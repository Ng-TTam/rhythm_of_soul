package com.rhythm_of_soul.content_service.dto.request;

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
    Type type;
    String caption;
    Boolean isPublic;
    ContentRequest content;
}
