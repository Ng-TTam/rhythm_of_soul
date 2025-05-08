package com.rhythm_of_soul.content_service.controller;

import com.rhythm_of_soul.content_service.dto.ApiResponse;
import com.rhythm_of_soul.content_service.dto.response.SongResponse;
import com.rhythm_of_soul.content_service.service.AudioStreamService;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/audio")
public class AudioStreamController {

    private final AudioStreamService audioStreamService;


    @GetMapping(value = "/{filename}", produces = "audio/mpeg")
    public ResponseEntity<InputStreamResource> streamAudio(
            @PathVariable String filename,
            @RequestHeader(value = HttpHeaders.RANGE, required = false) String rangeHeader) {

        return audioStreamService.getAudioStream(filename, rangeHeader);
    }
    @GetMapping("/content/{songId}")
    public ApiResponse<SongResponse> getContent(@PathVariable String songId) {
        return ApiResponse.<SongResponse>builder()
                .message("Content fetched successfully")
                .data(audioStreamService.getContent(songId))
                .build();
    }
}

