package com.rhythm_of_soul.identity_service.service;

import com.rhythm_of_soul.identity_service.dto.request.FollowRequest;

public interface RedisPublisher {
    void publishFollowEvent(FollowRequest request);
}
