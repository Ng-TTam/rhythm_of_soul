package com.rhythm_of_soul.application.factory.strategy;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.response.ContentResponse;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.enums.Type;

public interface PostContentStrategy {
    Type getType();
    void validate(ContentRequest request);
    Content createContent(ContentRequest request);
    Content updateContent(Content existingContent, ContentRequest request);
    ContentResponse enrichContentResponse(Content content, ContentResponse contentResponse);
}
