package com.rhythm_of_soul.content_service.repository;

import com.rhythm_of_soul.content_service.entity.ListeningHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListeningHistoryRepository extends MongoRepository<ListeningHistory, String> {
}
