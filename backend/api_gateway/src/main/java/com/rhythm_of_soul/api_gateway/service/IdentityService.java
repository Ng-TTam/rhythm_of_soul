package com.rhythm_of_soul.api_gateway.service;

import com.rhythm_of_soul.api_gateway.dto.ApiResponse;
import com.rhythm_of_soul.api_gateway.dto.request.VerifyTokenRequest;
import com.rhythm_of_soul.api_gateway.dto.response.VerifyTokenResponse;
import com.rhythm_of_soul.api_gateway.repository.IdentityClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class IdentityService {
    IdentityClient identityClient;

    IdentityService(IdentityClient identityClient){ this.identityClient = identityClient;}

    public Mono<ApiResponse<VerifyTokenResponse>> verify(String token){
        return identityClient.verify(VerifyTokenRequest.builder()
                .token(token)
                .build());
    }
}