package com.rhythm_of_soul.notification_service.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewContentEvent {

    private String authorId;

    private String authorName;

    private String contentType;

    private String followerId;

    private String referenceId;

}
