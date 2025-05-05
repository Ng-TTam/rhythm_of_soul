package com.rhythm_of_soul.identity_service.service.impl;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import com.rhythm_of_soul.identity_service.dto.request.AuthenticationRequest;
import com.rhythm_of_soul.identity_service.dto.request.IntrospectRequest;
import com.rhythm_of_soul.identity_service.dto.request.LogoutRequest;
import com.rhythm_of_soul.identity_service.dto.request.RefreshRequest;
import com.rhythm_of_soul.identity_service.dto.response.AuthenticationResponse;
import com.rhythm_of_soul.identity_service.dto.response.IntrospectResponse;
import com.rhythm_of_soul.identity_service.entity.Account;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.repository.AccountRepository;
import com.rhythm_of_soul.identity_service.repository.RefreshTokenRepository;
import com.rhythm_of_soul.identity_service.service.AuthenticationService;
import com.rhythm_of_soul.identity_service.utils.JwtUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {

    JwtUtils jwtUtil;
    RefreshTokenRepository refreshTokenRepository;
    AccountRepository accountRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) {
        var token = request.getToken();
        boolean isValid = true;

        try {
            jwtUtil.verifyToken(token, false);
        } catch (AppException | JOSEException | ParseException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        Account account = accountRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), account.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);


        var accessToken = jwtUtil.generateToken(account, false);
        if(Boolean.FALSE.equals(request.getRemember())) {
            return AuthenticationResponse.builder()
                    .token(accessToken)
                    .build();
        }
        var refreshToken = jwtUtil.generateToken(account, true);

        jwtUtil.saveRefreshToken(account, refreshToken);

        return AuthenticationResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public void logout(LogoutRequest request) throws ParseException {
        var token = request.getToken();
        var signedJWT = SignedJWT.parse(token);
        var email = signedJWT.getJWTClaimsSet().getSubject();

        var account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        refreshTokenRepository.deleteByAccount(account);
    }

    @Override
    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var token = request.getToken();
        var signedJWT = jwtUtil.verifyToken(token, true);

        var accountId = signedJWT.getJWTClaimsSet().getSubject();
        var account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var storedToken = refreshTokenRepository.findByAccount(account)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        if (!storedToken.getToken().equals(token)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var accessToken = jwtUtil.generateToken(account, false);
        var newRefreshToken = jwtUtil.generateToken(account, true);

        jwtUtil.saveRefreshToken(account, newRefreshToken);

        return AuthenticationResponse.builder()
                .token(accessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

}
