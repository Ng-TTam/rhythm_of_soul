package com.rhythm_of_soul.content_service.service.Impl;

import com.rhythm_of_soul.content_service.common.Type;
import com.rhythm_of_soul.content_service.dto.PostResponse;
import com.rhythm_of_soul.content_service.entity.ListeningHistory;
import com.rhythm_of_soul.content_service.entity.Post;
import com.rhythm_of_soul.content_service.exception.AppException;
import com.rhythm_of_soul.content_service.exception.ErrorCode;
import com.rhythm_of_soul.content_service.repository.ListeningHistoryRepository;
import com.rhythm_of_soul.content_service.repository.PostRepository;
import com.rhythm_of_soul.content_service.service.ListeningHistoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ListeningHistoryServiceImpl implements ListeningHistoryService {
    PostRepository postRepository;
    ListeningHistoryRepository listeningHistoryRepository;
    MongoTemplate mongoTemplate;
    PostServiceImpl postServiceImpl;

    @Override
    public List<PostResponse> getSongPostsListened(String accountId, int page, int size) {
        if (page < 0 || size <= 0 || accountId == null) {
            return Collections.emptyList();
        }
        long skip = (long) page * size;

        List<AggregationOperation> pipeline = new ArrayList<>();

        pipeline.add(Aggregation.match(Criteria.where("accountId").is(accountId).and("type").is(Type.SONG)));
        pipeline.add(Aggregation.group("postId")
                .max("listenAt").as("listenAt"));

        pipeline.add(Aggregation.sort(Sort.by(Sort.Order.desc("listenAt"))));

        pipeline.add(Aggregation.skip(skip));
        pipeline.add(Aggregation.limit(size));

        Aggregation aggregation = Aggregation.newAggregation(pipeline);
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "listening_history", Document.class);

        List<String> postIds = results.getMappedResults().stream()
                .map(doc -> doc.getString("_id"))
                .collect(Collectors.toList());

        List<Post> posts = postRepository.findAllById(postIds);

        return postServiceImpl.processPosts(posts, accountId);
    }

    @Override
    public List<PostResponse> getTopSongPosts(int page, int size) {
        if (page < 0 || size <= 0) {
            return Collections.emptyList();
        }
        long skip = (long) page * size;

        // Aggregation count listening in 7 days
        Instant startOfWeek = Instant.now().minus(7, ChronoUnit.DAYS);
        List<AggregationOperation> operations = new ArrayList<>();

        // Filter type = SONG & listen in 7 days
        operations.add(Aggregation.match(Criteria.where("type").is(Type.SONG)
                .and("listenAt").gte(startOfWeek)));

        operations.add(Aggregation.group("postId")
                .count().as("listenCount"));

        operations.add(Aggregation.sort(Sort.by(Sort.Order.desc("listenCount"))));

        operations.add(Aggregation.skip(skip));
        operations.add(Aggregation.limit(size));

        Aggregation aggregation = Aggregation.newAggregation(operations);
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "listening_history", Document.class);

        List<String> postIds = results.getMappedResults().stream()
                .map(doc -> doc.getString("_id"))
                .collect(Collectors.toList());

        List<Post> posts = postRepository.findAllById(postIds);

        return postServiceImpl.processPosts(posts, null);
    }

    @Override
    public void recordListen(String accountId, String sessionId, String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        if (post.getType() != Type.SONG) {
            throw new IllegalArgumentException("Post is not a song");
        }

        if (sessionId == null) {
            throw new IllegalArgumentException("Missing sessionId");
        }

        Query query = new Query(Criteria.where("postId").is(postId)
                .and("sessionId").is(sessionId)
                .and("listenAt").gte(Instant.now().minus(60, ChronoUnit.SECONDS)));
        if (mongoTemplate.exists(query, ListeningHistory.class)) {
            return;
        }

        // 1 account is counted 1 in 24h
        if (accountId != null) {
            Query accountQuery = new Query(Criteria.where("postId").is(postId)
                    .and("accountId").is(accountId)
                    .and("listenAt").gte(Instant.now().truncatedTo(ChronoUnit.DAYS)));
            if (mongoTemplate.exists(accountQuery, ListeningHistory.class)) {
                return; // Bỏ qua nếu accountId đã nghe bài này hôm nay
            }
        }

        ListeningHistory history = ListeningHistory.builder()
                .accountId(accountId)
                .sessionId(sessionId)
                .postId(postId)
                .tag(post.getContent().getTags())
                .listenAt(Instant.now())
                .build();
        listeningHistoryRepository.save(history);

        Query updateQuery = new Query(Criteria.where("_id").is(postId));
        Update update = new Update().inc("listenCount", 1);
        mongoTemplate.findAndModify(updateQuery, update, Post.class);

        log.info("Recorded listen for postId: " + postId + ", sessionId: " + sessionId);
    }

}
