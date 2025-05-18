package com.rhythm_of_soul.content_service.entity;

import com.rhythm_of_soul.content_service.common.Tag;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "listening_history")
public class ListeningHistory {

    @Id
    private String id;
    private String accountId;
    private String sessionId;
    private String postId;
    private List<Tag> tag;
    private Instant listenAt;
}
