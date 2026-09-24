package com.rhythm_of_soul.application.factory.file;

import com.rhythm_of_soul.domain.model.enums.FileType;
import com.rhythm_of_soul.infrastructure.config.MinioConfig;

public interface FileUploadStrategy {
    FileType getFileType();
    String getBucketName(MinioConfig minioConfig);
}
