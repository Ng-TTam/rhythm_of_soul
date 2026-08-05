package com.rhythm_of_soul.application.model.request;

import com.rhythm_of_soul.application.exception.ValidPostRequest;
import com.rhythm_of_soul.domain.model.enums.Type;
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
