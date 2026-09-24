package com.rhythm_of_soul.application.factory.strategy;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.response.ContentResponse;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import com.rhythm_of_soul.infrastructure.utils.SaveFileMinio;
import org.springframework.stereotype.Component;

@Component
public class SongPostContentStrategy extends AbstractPostContentStrategy {

    public SongPostContentStrategy(SaveFileMinio saveFileMinio, MinioConfig minioConfig) {
        super(saveFileMinio, minioConfig);
    }

    @Override
    public Type getType() {
        return Type.SONG;
    }

    @Override
    public Content createContent(ContentRequest request) {
        if (request == null) return null;
        return Content.builder()
                .tags(request.getTags())
                .title(request.getTitle())
                .mediaUrl(request.getMediaUrl())
                .coverUrl(request.getCoverUrl())
                .imageUrl(request.getImageUrl())
                .build();
    }

    @Override
    public Content updateContent(Content existingContent, ContentRequest request) {
        if (request == null) return existingContent;
        if (existingContent == null) {
            return createContent(request);
        }
        updateCommonFields(existingContent, request);
        if (request.getMediaUrl() != null && isNewUploadedUrl(request.getMediaUrl())) {
            existingContent.setMediaUrl(request.getMediaUrl());
        }
        return existingContent;
    }

    @Override
    public ContentResponse enrichContentResponse(Content content, ContentResponse contentResponse) {
        if (content == null || contentResponse == null) {
            return contentResponse;
        }
        enrichImageAndCoverUrls(content, contentResponse);
        if (content.getMediaUrl() != null && !content.getMediaUrl().isBlank()) {
            contentResponse.setMediaUrl(saveFileMinio.generatePresignedUrl(minioConfig.getSongsBucket(), content.getMediaUrl()));
        }
        return contentResponse;
    }
}
