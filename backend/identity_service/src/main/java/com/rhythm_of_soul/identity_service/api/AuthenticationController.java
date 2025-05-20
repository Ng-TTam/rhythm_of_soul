package com.rhythm_of_soul.identity_service.api;

import java.text.ParseException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.nimbusds.jose.JOSEException;
import com.rhythm_of_soul.identity_service.constant.SecurityConstants;
import com.rhythm_of_soul.identity_service.dto.request.AuthenticationRequest;
import com.rhythm_of_soul.identity_service.dto.request.IntrospectRequest;
import com.rhythm_of_soul.identity_service.dto.request.LogoutRequest;
import com.rhythm_of_soul.identity_service.dto.request.RefreshRequest;
import com.rhythm_of_soul.identity_service.dto.response.ApiResponse;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import com.rhythm_of_soul.identity_service.dto.response.IntrospectResponse;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.service.AuthenticationService;
import com.rhythm_of_soul.identity_service.utils.CookieUtils;

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
    public ApiResponse<AuthenticationResponse> login(
            @Valid @RequestBody AuthenticationRequest request, HttpServletResponse httpResponse) {

        var result = authenticationService.authenticate(request);

        if (Boolean.TRUE.equals(request.getRemember())) {
            CookieUtils.addCookieRemember(
                    httpResponse, SecurityConstants.REFRESH_TOKEN, result.getRefreshToken(), 30 * 24 * 60 * 60);
        } else {
            CookieUtils.addCookie(httpResponse, SecurityConstants.REFRESH_TOKEN, result.getRefreshToken());
        }

        result.setRefreshToken(null);

        // KHÔNG lưu access token vào cookie → trả về để client tự dùng
        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @GetMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(
            @RequestHeader(SecurityConstants.HEADER_STRING) String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);
        var request = IntrospectRequest.builder().token(token).build();
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refresh(HttpServletRequest request, HttpServletResponse response)
            throws ParseException, JOSEException {

        String refreshToken = CookieUtils.getCookieByName(SecurityConstants.REFRESH_TOKEN, request);
        if (refreshToken == null) {
            throw new AppException(ErrorCode.MISSING_REFRESH_TOKEN);
        }

        RefreshRequest refreshRequest =
                RefreshRequest.builder().token(refreshToken).build();
        var result = authenticationService.refreshToken(refreshRequest);

        // Trả access token mới trong body
        // Lưu refresh token mới nếu dùng rotation
        CookieUtils.addCookieRemember(
                response, SecurityConstants.REFRESH_TOKEN, result.getRefreshToken(), 30 * 24 * 60 * 60);
        result.setRefreshToken(null);

        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(HttpServletRequest request, HttpServletResponse response)
            throws ParseException, JOSEException {

        String refreshToken = CookieUtils.getCookieByName(SecurityConstants.REFRESH_TOKEN, request);
        if (refreshToken != null) {
            LogoutRequest logoutRequest =
                    LogoutRequest.builder().token(refreshToken).build();
            authenticationService.logout(logoutRequest);
            CookieUtils.deleteCookieByName(SecurityConstants.REFRESH_TOKEN, request, response);
        }

        return ApiResponse.<Void>builder().message("Successfully logged out.").build();
    }

    // lấy token từ Bearer
    private String extractBearerToken(String header) {
        if (header != null && header.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            return header.substring(7);
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
        //                UnauthorizedException("Missing or invalid Authorization header");
    }
}
