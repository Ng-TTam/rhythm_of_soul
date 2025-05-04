package com.rhythm_of_soul.content_service.repository;

import com.rhythm_of_soul.content_service.entity.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findAllByPostId(String postId);
}

