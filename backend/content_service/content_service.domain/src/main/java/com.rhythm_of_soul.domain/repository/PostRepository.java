package com.rhythm_of_soul.domain.repository;

import com.rhythm_of_soul.domain.model.entity.Post;
import com.rhythm_of_soul.domain.model.enums.Type;

import java.awt.print.Pageable;
import java.util.List;

public interface PostRepository {

    List<Post> findAllByAccountId(String accountId, Pageable pageable);
    List<Post> findAllByAccountIdAndType(String accountId, Type type);
}
