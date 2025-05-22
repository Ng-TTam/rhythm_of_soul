package com.rhythm_of_soul.content_service.repository;

import com.rhythm_of_soul.content_service.common.Type;
import com.rhythm_of_soul.content_service.entity.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findAllByAccountId(String accountId, Pageable pageable);
    List<Post> findAllByAccountIdAndType(String accountId, Type type);

//    @Query("{ $or: [ " +
//            "{ type: 'TEXT', 'caption': { $regex: ?0, $options: 'i' }, type: { $in: ?1 } }, " +
//            "{ type: { $in: ['SONG', 'ALBUM', 'PLAYLIST'] }, 'content.title': { $regex: ?0, $options: 'i' }, type: { $in: ?1 } } " +
//            "] }")
//    Page<Post> findAllByKeyword(String keyword, List<String> types, Pageable pageable);
    List<Post> findAllByType(Type type);
}

