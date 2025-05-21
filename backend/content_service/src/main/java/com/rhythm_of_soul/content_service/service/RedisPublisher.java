package com.rhythm_of_soul.content_service.service;

import com.rhythm_of_soul.content_service.dto.request.LikeCommentRequest;
import com.rhythm_of_soul.content_service.dto.request.NewContentEvent;

public interface RedisPublisher {
  void publishNewContentEvent(NewContentEvent newContent);
  void publishLikeCommentEvent(LikeCommentRequest event);
}
