package com.rhythm_of_soul.domain.model.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LikeResponse {
    private String id;
    private String accountId;
}
