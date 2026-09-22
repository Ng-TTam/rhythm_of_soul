package com.rhythm_of_soul.application.factory.file;

import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import org.springframework.stereotype.Component;

@Component
public class ImageFileUploadStrategy implements FileUploadStrategy {
    @Override
    public String getFileType() {
        return "image";
    }

    @Override
    public String getBucketName(MinioConfig minioConfig) {
        return minioConfig.getImagesBucket();
    }
}
