package com.rhythm_of_soul.controller.http;

import com.rhythm_of_soul.application.model.response.SongResponse;
import com.rhythm_of_soul.application.service.audio_stream.AudioStreamService;
import com.rhythm_of_soul.domain.model.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
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
                .result(audioStreamService.getContent(songId))
                .build();
    }
}
