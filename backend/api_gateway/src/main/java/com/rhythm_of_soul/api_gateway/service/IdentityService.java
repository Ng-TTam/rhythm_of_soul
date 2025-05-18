package com.rhythm_of_soul.api_gateway.service;

import com.rhythm_of_soul.api_gateway.dto.ApiResponse;
import com.rhythm_of_soul.api_gateway.dto.response.VerifyTokenResponse;
import reactor.core.publisher.Mono;

public interface IdentityService {
    Mono<ApiResponse<VerifyTokenResponse>> verify(String token);
}
