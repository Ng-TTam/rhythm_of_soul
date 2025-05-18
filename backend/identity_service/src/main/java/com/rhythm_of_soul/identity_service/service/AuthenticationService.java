package com.rhythm_of_soul.identity_service.service;

import java.text.ParseException;

import com.nimbusds.jose.JOSEException;
import com.rhythm_of_soul.identity_service.dto.request.AuthenticationRequest;
import com.rhythm_of_soul.identity_service.dto.request.IntrospectRequest;
import com.rhythm_of_soul.identity_service.dto.request.LogoutRequest;
import com.rhythm_of_soul.identity_service.dto.request.RefreshRequest;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import com.rhythm_of_soul.identity_service.dto.response.IntrospectResponse;

public interface AuthenticationService {
    /**
     * authenticate account
     * @param request authenticate
     * @return access token, refresh token (if check remember true)
     */
    AuthenticationResponse authenticate(AuthenticationRequest request);

    void logout(LogoutRequest request) throws ParseException, JOSEException;

    AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException;

    /**
     * verify token
     * @param request access token need to verify is signed in system
     * @return boolean isValid
     */
    IntrospectResponse introspect(IntrospectRequest request);
}
