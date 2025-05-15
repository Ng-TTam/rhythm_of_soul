
package com.rhythm_of_soul.notification_service.repository;

import com.rhythm_of_soul.notification_service.constant.NotiType;
import com.rhythm_of_soul.notification_service.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {
  List<Notification> findByRecipientIdAndIsReadFalseAndTypeIn(String recipientId, List<String> types);
  List<Notification> findByRecipientIdAndIsReadTrueAndCreatedAtAfterOrderByCreatedAtDesc(String recipientId, LocalDateTime createdAt);
  Optional<Notification> findByRecipientIdAndReferenceIdAndTypeAndIsReadFalse(
          String recipientId,
          String referenceId,
          NotiType type
  );

}
