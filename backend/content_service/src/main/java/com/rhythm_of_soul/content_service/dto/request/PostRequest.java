package com.rhythm_of_soul.content_service.dto.request;

import com.rhythm_of_soul.content_service.common.Type;
import com.rhythm_of_soul.content_service.exception.validator.ValidPostRequest;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ValidPostRequest
public class PostRequest {
    Type type;
    String caption;
    Boolean isPublic;
    ContentRequest content;
}
