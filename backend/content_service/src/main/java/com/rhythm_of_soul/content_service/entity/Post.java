package com.rhythm_of_soul.content_service.entity;

import com.rhythm_of_soul.content_service.common.Tag;
import com.rhythm_of_soul.content_service.common.Type;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "posts")
public class Post {

    @Id
     String id;
     String accountId;
     Type type;
     String caption;
     Content content;
     int viewCount;
     int likeCount;
     int commentCount;
     boolean isPublic;
     Instant createdAt;
     Instant updatedAt;
     Instant scheduledAt;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @Document(collection = "posts")
    public static class Content {
         String title;
         String mediaUrl;
         List<String> songIds;
         String originalPostId;
         List<Tag> tags;
         String imageUrl;
         String coverUrl;
    }
}

