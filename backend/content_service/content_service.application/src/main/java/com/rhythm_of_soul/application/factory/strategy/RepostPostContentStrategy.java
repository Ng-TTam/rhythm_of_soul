package com.rhythm_of_soul.application.factory.strategy;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.response.ContentResponse;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import com.rhythm_of_soul.domain.repository.PostRepository;
import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import com.rhythm_of_soul.infrastructure.utils.SaveFileMinio;
import org.springframework.stereotype.Component;

@Component
public class RepostPostContentStrategy extends AbstractPostContentStrategy {

    public RepostPostContentStrategy(SaveFileMinio saveFileMinio, MinioConfig minioConfig, PostRepository postRepository) {
        super(saveFileMinio, minioConfig, postRepository);
    }

    @Override
    public Type getType() {
        return Type.REPOST;
    }

    @Override
    public void validate(ContentRequest request) {
        super.validate(request);
        if (request.getOriginalPostId() == null || request.getOriginalPostId().isBlank()) {
            throw new AppException(ErrorCode.INVALID_POST_TYPE);
        }
    }

    @Override
    public Content createContent(ContentRequest request) {
        if (request == null) return null;
        return Content.builder()
                .originalPostId(request.getOriginalPostId())
                .build();
    }

    @Override
    public Content updateContent(Content existingContent, ContentRequest request) {
        if (request == null) return existingContent;
        if (existingContent == null) {
            return createContent(request);
        }
        if (request.getOriginalPostId() != null) {
            existingContent.setOriginalPostId(request.getOriginalPostId());
        }
        return existingContent;
    }

    @Override
    public ContentResponse enrichContentResponse(Content content, ContentResponse contentResponse) {
        return contentResponse;
    }
}
