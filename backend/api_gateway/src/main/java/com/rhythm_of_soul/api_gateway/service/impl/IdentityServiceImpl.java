package com.rhythm_of_soul.api_gateway.service.impl;

import com.rhythm_of_soul.api_gateway.dto.ApiResponse;
import com.rhythm_of_soul.api_gateway.dto.request.VerifyTokenRequest;
import com.rhythm_of_soul.api_gateway.dto.response.VerifyTokenResponse;
import com.rhythm_of_soul.api_gateway.repository.IdentityClient;
import com.rhythm_of_soul.api_gateway.service.IdentityService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class IdentityServiceImpl implements IdentityService {
    IdentityClient identityClient;

    IdentityServiceImpl(IdentityClient identityClient){ this.identityClient = identityClient;}

    @Override
    public Mono<ApiResponse<VerifyTokenResponse>> verify(String token){
        return identityClient.verify(VerifyTokenRequest.builder()
                .token(token)
                .build());
    }
}