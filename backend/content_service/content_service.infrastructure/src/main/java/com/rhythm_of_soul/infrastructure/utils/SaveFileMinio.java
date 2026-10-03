package com.rhythm_of_soul.infrastructure.utils;

import com.rhythm_of_soul.domain.model.exception.AppException;
import com.rhythm_of_soul.domain.model.exception.ErrorCode;
import com.rhythm_of_soul.infrastructure.config.MinioConfig;
import io.minio.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class SaveFileMinio {
    private final MinioClient minioClient;
    private final MinioConfig minioConfig;

    public String saveFile(MultipartFile file, String bucket) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            InputStream inputStream = file.getInputStream();

            boolean isExist = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(bucket)
                            .build());
            if (!isExist) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(filename)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
            return filename;
        } catch (Exception e) {
            log.error("Failed to save file to MinIO bucket: {}", bucket, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public String generatePresignedUrl(String bucketName, String objectName) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(60 * 60 * 24) // 1 day
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to generate presigned URL for bucket: {}, object: {}", bucketName, objectName, e);
            return null;
        }
    }
}
