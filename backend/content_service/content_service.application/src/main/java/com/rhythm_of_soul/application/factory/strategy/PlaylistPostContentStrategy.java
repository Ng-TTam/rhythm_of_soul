package com.rhythm_of_soul.application.factory.strategy;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.response.ContentResponse;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.enums.Type;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import com.rhythm_of_soul.infrastructure.utils.SaveFileMinio;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PlaylistPostContentStrategy implements PostContentStrategy {
    private final SaveFileMinio saveFileMinio;
    private final MinioConfig minioConfig;

    @Override
    public Type getType() {
        return Type.PLAYLIST;
    }

    @Override
    public void validate(ContentRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_POST_TYPE);
        }
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
        if (request.getTitle() != null) existingContent.setTitle(request.getTitle());
        if (request.getImageUrl() != null && !request.getImageUrl().contains("http://localhost:9000")) {
            existingContent.setImageUrl(request.getImageUrl());
        }
        if (request.getCoverUrl() != null && !request.getCoverUrl().contains("http://localhost:9000")) {
            existingContent.setCoverUrl(request.getCoverUrl());
        }
        if (request.getTags() != null) existingContent.setTags(request.getTags());
        if (request.getSongIds() != null) existingContent.setSongIds(request.getSongIds());
        return existingContent;
    }

    @Override
    public ContentResponse enrichContentResponse(Content content, ContentResponse contentResponse) {
        if (content == null || contentResponse == null) {
            return contentResponse;
        }
        if (content.getImageUrl() != null) {
            contentResponse.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), content.getImageUrl()));
        }
        if (content.getCoverUrl() != null) {
            contentResponse.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), content.getCoverUrl()));
        }
        return contentResponse;
    }
}
