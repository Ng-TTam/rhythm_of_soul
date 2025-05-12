
package com.rhythm_of_soul.notification_service.entity;

import com.rhythm_of_soul.notification_service.constant.NotiType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    private String recipientId;

    private String senderId;

    @Enumerated(EnumType.STRING)
    private NotiType type;

    private String referenceId;

    private String referenceType;

    private String message;

    private boolean isRead = false;

    private LocalDateTime createdAt;
}
