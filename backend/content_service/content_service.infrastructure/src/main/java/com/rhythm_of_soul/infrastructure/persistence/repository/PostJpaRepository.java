package com.rhythm_of_soul.infrastructure.persistence.repository;

import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.infrastructure.persistence.model.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface PostJpaRepository extends JpaRepository<PostEntity, String> {
    List<PostEntity> findAllByAccountId(String accountId, Pageable pageable);
    List<PostEntity> findAllByAccountIdAndType(String accountId, Type type);
}
