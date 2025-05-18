package com.rhythm_of_soul.content_service.service.Impl;

import com.rhythm_of_soul.content_service.config.MinioConfig;
import com.rhythm_of_soul.content_service.dto.response.SongResponse;
import com.rhythm_of_soul.content_service.entity.Post;
import com.rhythm_of_soul.content_service.repository.PostRepository;
import com.rhythm_of_soul.content_service.service.AudioStreamService;
import com.rhythm_of_soul.content_service.utils.SaveFileMinio;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class AudioStreamServiceImpl implements AudioStreamService {
    MinioClient minioClient;
    MinioConfig minioConfig;
    SaveFileMinio saveFileMinio;
    PostRepository postRepository;

    public ResponseEntity<InputStreamResource> getAudioStream(String filename, String rangeHeader) {
        try {
            String bucketName = minioConfig.getSongsBucket();
            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucketName)
                            .object(filename)
                            .build()
            );

            long fileSize = stat.size();
            long start = 0;
            long end = fileSize - 1;

            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                List<HttpRange> httpRanges = HttpRange.parseRanges(rangeHeader);
                if (!httpRanges.isEmpty()) {
                    HttpRange range = httpRanges.get(0);
                    start = range.getRangeStart(fileSize);
                    end = range.getRangeEnd(fileSize);
                }
            }

            long contentLength = end - start + 1;

            InputStream inputStream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(filename)
                            .offset(start)
                            .length(contentLength)
                            .build()
            );

            InputStreamResource resource = new InputStreamResource(inputStream);

            return ResponseEntity.status(rangeHeader != null ? HttpStatus.PARTIAL_CONTENT : HttpStatus.OK)
                    .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength))
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileSize)
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public SongResponse getContent(String songId) {
        Post post = postRepository.findById(songId).orElseThrow(() -> new RuntimeException("Post not found"));
        String []cover = post.getContent().getCoverUrl().split("/");
        String []image = post.getContent().getImageUrl().split("/");
        String coverUrl = saveFileMinio.generatePresignedUrl(minioConfig.getCoversBucket(), cover[cover.length - 1]);
        String imageUrl = saveFileMinio.generatePresignedUrl(minioConfig.getImagesBucket(), image[image.length - 1]);
        return SongResponse.builder()
                .title(post.getContent().getTitle())
                .imageUrl(imageUrl)
                .coverUrl(coverUrl)
                .songId(post.getId())
                .tags(post.getContent().getTags())
                .mediaUrl(post.getContent().getMediaUrl())
                .build();
    }



}
