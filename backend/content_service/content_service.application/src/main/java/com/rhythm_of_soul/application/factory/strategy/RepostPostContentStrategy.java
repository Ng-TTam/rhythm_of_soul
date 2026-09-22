package com.rhythm_of_soul.application.factory.strategy;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.response.ContentResponse;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class RepostPostContentStrategy implements PostContentStrategy {

    @Override
    public Type getType() {
        return Type.REPOST;
    }

    @Override
    public void validate(ContentRequest request) {
        if (request == null || request.getOriginalPostId() == null || request.getOriginalPostId().isBlank()) {
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
