package com.rhythm_of_soul.content_service.service;

import com.rhythm_of_soul.content_service.dto.response.SongResponse;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;

public interface AudioStreamService {
    ResponseEntity<InputStreamResource> getAudioStream(String filename, String rangeHeader);
    SongResponse getContent(String songId);

}
