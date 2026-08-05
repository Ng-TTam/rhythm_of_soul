package com.rhythm_of_soul.application.service.redis_publisher;

import com.rhythm_of_soul.application.model.request.LikeCommentRequest;
import com.rhythm_of_soul.application.model.request.NewContentEvent;

public interface RedisPublisher {
  void publishNewContentEvent(NewContentEvent newContent);
  void publishLikeCommentEvent(LikeCommentRequest event);
}
