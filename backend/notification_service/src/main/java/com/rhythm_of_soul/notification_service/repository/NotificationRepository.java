package com.rhythm_of_soul.notification_service.repository;

import com.rhythm_of_soul.notification_service.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
  List<Notification> findByRecipientIdAndIsReadFalseAndTypeIn(String recipientId, List<String> types);
  List<Notification> findTop5ByRecipientIdOrderByCreatedAtDesc(String recipientId);
}
