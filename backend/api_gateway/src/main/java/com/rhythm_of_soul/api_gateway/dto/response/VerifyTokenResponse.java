package com.rhythm_of_soul.api_gateway.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyTokenResponse {
    boolean valid;
}
