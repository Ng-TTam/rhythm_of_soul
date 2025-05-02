package com.rhythm_of_soul.notification_service.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewContentEvent {

    @JsonProperty("authorId")
    private String authorId;

    @JsonProperty("authorName")
    private String authorName;

    @JsonProperty("contentType")
    private String contentType;

    @JsonProperty("title")
    private String title;

    @JsonProperty("followerId")
    private String followerId;

    @JsonProperty("referenceId")
    private String referenceId;

}
