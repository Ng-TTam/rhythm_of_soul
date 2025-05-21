package com.rhythm_of_soul.content_service.service.Impl;

import com.rhythm_of_soul.content_service.dto.ApiResponse;
import com.rhythm_of_soul.content_service.dto.response.UserBasicInfoResponse;
import com.rhythm_of_soul.content_service.service.IdentityClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IdentityClientImpl  implements IdentityClient {
  private final RestTemplate restTemplate;

  @Value("${identity-service.base-url}")
  private String identityServiceUrl;

  public List<String> getFollowerIds(String userId) {
    String url = identityServiceUrl + "/" + userId + "/followersIds";

    // Lấy JWT token từ context (nếu đang dùng Bearer Token auth)
    String token = null;
    var auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth instanceof JwtAuthenticationToken jwtAuth) {
      token = jwtAuth.getToken().getTokenValue();
    }

    HttpHeaders headers = new HttpHeaders();
    if (token != null) {
      headers.set("Authorization", "Bearer " + token);
    }

    HttpEntity<Void> entity = new HttpEntity<>(headers);

    ResponseEntity<ApiResponse<List<String>>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<ApiResponse<List<String>>>() {}
    );

    if (response.getBody() == null || response.getBody().getResult() == null) {
      throw new RuntimeException("Can’t get followers from identity service");
    }

    return response.getBody().getResult();
  }

  public UserBasicInfoResponse getUserInfoByAccountId(String accountId) {
    String url = identityServiceUrl + "/" + accountId + "/userId";

    String token = null;
    var auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth instanceof JwtAuthenticationToken jwtAuth) {
      token = jwtAuth.getToken().getTokenValue();
    }

    HttpHeaders headers = new HttpHeaders();
    if (token != null) {
      headers.set("Authorization", "Bearer " + token);
    }

    HttpEntity<Void> entity = new HttpEntity<>(headers);

    ResponseEntity<ApiResponse<UserBasicInfoResponse>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<ApiResponse<UserBasicInfoResponse>>() {}
    );

    if (response.getBody() == null || response.getBody().getResult() == null) {
      throw new RuntimeException("Can’t get user info from identity service");
    }

    return response.getBody().getResult();
  }


}
