package com.rhythm_of_soul.application.factory.file;

import com.rhythm_of_soul.infrastructure.config.MinioConfig;

public interface FileUploadStrategy {
    String getFileType();
    String getBucketName(MinioConfig minioConfig);
}
