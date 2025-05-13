package com.rhythm_of_soul.content_service.repository;

import com.rhythm_of_soul.content_service.common.Type;
import com.rhythm_of_soul.content_service.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findAllByAccountId(String accountId);
    List<Post> findAllByAccountIdAndType(String accountId, Type type);

}

