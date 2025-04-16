package com.rhythm_of_soul.identity_service.controller;

import java.text.ParseException;
import java.util.Base64;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythm_of_soul.identity_service.constant.SecurityConstants;
import com.rhythm_of_soul.identity_service.utils.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import com.nimbusds.jose.JOSEException;
import com.rhythm_of_soul.identity_service.dto.request.*;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import com.rhythm_of_soul.identity_service.dto.response.IntrospectResponse;
import com.rhythm_of_soul.identity_service.service.AuthenticationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request,
                                                     HttpServletRequest httpRequest,
                                                     HttpServletResponse httpResponse) {
        var result = authenticationService.authenticate(request);
        CookieUtil.addCookie(httpResponse, SecurityConstants.ACCESS_TOKEN, result.getToken());
        if(Boolean.TRUE.equals(request.getRemember())) {
            CookieUtil.addCookieRemember(httpResponse, SecurityConstants.REFRESH_TOKEN, result.getRefreshToken(), 30 * 24 * 60 * 60);
        } else {
            result.setRefreshToken(null);
            CookieUtil.deleteCookieByName(SecurityConstants.REFRESH_TOKEN, httpRequest, httpResponse);
        }

        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }
    @GetMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@CookieValue("access_token") String token) {
        IntrospectRequest request = IntrospectRequest.builder().token(token).build();
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }


    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request,
                                                     HttpServletResponse httpResponse)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        CookieUtil.addCookie(httpResponse, SecurityConstants.ACCESS_TOKEN, result.getToken());
        CookieUtil.addCookieRemember(httpResponse, SecurityConstants.REFRESH_TOKEN, result.getRefreshToken(), 30 * 24 * 60 * 60);
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder().build();
    }

}
