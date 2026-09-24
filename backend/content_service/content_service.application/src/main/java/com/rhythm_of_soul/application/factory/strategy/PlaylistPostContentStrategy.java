package com.rhythm_of_soul.application.factory.strategy;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.response.ContentResponse;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import com.rhythm_of_soul.infrastructure.utils.SaveFileMinio;
import org.springframework.stereotype.Component;

@Component
public class PlaylistPostContentStrategy extends AbstractPostContentStrategy {

    public PlaylistPostContentStrategy(SaveFileMinio saveFileMinio, MinioConfig minioConfig) {
        super(saveFileMinio, minioConfig);
    }

    @Override
    public Type getType() {
        return Type.PLAYLIST;
    }

    @Override
    public Content createContent(ContentRequest request) {
        if (request == null) return null;
        return Content.builder()
                .tags(request.getTags())
                .title(request.getTitle())
                .imageUrl(request.getImageUrl())
                .coverUrl(request.getCoverUrl())
                .songIds(request.getSongIds())
                .build();
    }

    @Override
    public Content updateContent(Content existingContent, ContentRequest request) {
        if (request == null) return existingContent;
        if (existingContent == null) {
            return createContent(request);
        }
        updateCommonFields(existingContent, request);
        if (request.getSongIds() != null) {
            existingContent.setSongIds(request.getSongIds());
        }
        return existingContent;
    }

    @Override
    public ContentResponse enrichContentResponse(Content content, ContentResponse contentResponse) {
        return enrichImageAndCoverUrls(content, contentResponse);
    }
}
