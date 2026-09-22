package com.rhythm_of_soul.application.factory.strategy;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.response.ContentResponse;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import org.springframework.stereotype.Component;

@Component
public class TextPostContentStrategy implements PostContentStrategy {

    @Override
    public Type getType() {
        return Type.TEXT;
    }

    @Override
    public void validate(ContentRequest request) {
        if (request != null) {
            if ((request.getImageUrl() != null && !request.getImageUrl().isBlank())
                    || (request.getCoverUrl() != null && !request.getCoverUrl().isBlank())
                    || (request.getMediaUrl() != null && !request.getMediaUrl().isBlank())) {
                throw new AppException(ErrorCode.INVALID_POST_TYPE);
            }
        }
    }

    @Override
    public Content createContent(ContentRequest request) {
        return null;
    }

    @Override
    public Content updateContent(Content existingContent, ContentRequest request) {
        return null;
    }

    @Override
    public ContentResponse enrichContentResponse(Content content, ContentResponse contentResponse) {
        return null;
    }
}
