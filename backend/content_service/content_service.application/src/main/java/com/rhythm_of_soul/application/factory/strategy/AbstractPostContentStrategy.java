package com.rhythm_of_soul.application.factory.strategy;

import com.rhythm_of_soul.application.model.request.ContentRequest;
import com.rhythm_of_soul.application.model.response.ContentResponse;
import com.rhythm_of_soul.domain.model.entity.Content;
import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import com.rhythm_of_soul.infrastructure.utils.SaveFileMinio;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public abstract class AbstractPostContentStrategy implements PostContentStrategy {
    protected final SaveFileMinio saveFileMinio;
    protected final MinioConfig minioConfig;

    @Override
    public void validate(ContentRequest request) {
        if (request == null) {
            throw new AppException(ErrorCode.INVALID_POST_TYPE);
        }
    }

    /**
     * Checks if the URL provided in update request is a raw file path or new object name
     * by checking against the configured MinIO base URL in environment properties.
     */
    protected boolean isNewUploadedUrl(String url) {
        if (url == null || url.isBlank()) {
            return false;
        }
        String minioUrl = minioConfig != null ? minioConfig.getUrl() : null;
        if (minioUrl != null && !minioUrl.isBlank()) {
            return !url.contains(minioUrl);
        }
        return true;
    }

    /**
     * Common update logic for title, tags, imageUrl, coverUrl
     */
    protected void updateCommonFields(Content existingContent, ContentRequest request) {
        if (request == null || existingContent == null) return;

        if (request.getTitle() != null) {
            existingContent.setTitle(request.getTitle());
        }
        if (request.getTags() != null) {
            existingContent.setTags(request.getTags());
        }
        if (request.getImageUrl() != null && isNewUploadedUrl(request.getImageUrl())) {
            existingContent.setImageUrl(request.getImageUrl());
        }
        if (request.getCoverUrl() != null && isNewUploadedUrl(request.getCoverUrl())) {
            existingContent.setCoverUrl(request.getCoverUrl());
        }
    }

    /**
     * Common presigned URL enrichment for image and cover URLs.
     */
    protected ContentResponse enrichImageAndCoverUrls(Content content, ContentResponse contentResponse) {
        if (content == null || contentResponse == null) {
            return contentResponse;
        }
        if (content.getImageUrl() != null && !content.getImageUrl().isBlank()) {
            contentResponse.setImageUrl(saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), content.getImageUrl()));
        }
        if (content.getCoverUrl() != null && !content.getCoverUrl().isBlank()) {
            contentResponse.setCoverUrl(saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), content.getCoverUrl()));
        }
        return contentResponse;
    }
}
