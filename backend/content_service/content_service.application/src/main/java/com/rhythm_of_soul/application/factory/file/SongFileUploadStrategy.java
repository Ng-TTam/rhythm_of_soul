package com.rhythm_of_soul.application.factory.file;

import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import org.springframework.stereotype.Component;

@Component
public class SongFileUploadStrategy implements FileUploadStrategy {
    @Override
    public String getFileType() {
        return "song";
    }

    @Override
    public String getBucketName(MinioConfig minioConfig) {
        return minioConfig.getSongsBucket();
    }
}
