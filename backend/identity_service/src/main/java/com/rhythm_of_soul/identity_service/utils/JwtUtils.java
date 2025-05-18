package com.rhythm_of_soul.identity_service.utils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.rhythm_of_soul.identity_service.entity.Account;
import com.rhythm_of_soul.identity_service.entity.RefreshToken;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import com.rhythm_of_soul.identity_service.repository.RefreshTokenRepository;

import lombok.experimental.NonFinal;

@Service
public class JwtUtils {
    private final RefreshTokenRepository refreshTokenRepository;

    JwtUtils(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public void saveRefreshToken(Account account, String token) {
        Instant expiry = Instant.now().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS);

        RefreshToken refreshToken = refreshTokenRepository
                .findByAccount(account)
                .map(existingToken -> {
                    existingToken.setToken(token);
                    existingToken.setExpiryTime(expiry);
                    return existingToken;
                })
                .orElse(RefreshToken.builder()
                        .account(account)
                        .token(token)
                        .expiryTime(expiry)
                        .build());

        refreshTokenRepository.save(refreshToken);
    }

    public String generateToken(Account account, boolean isRefresh) {
        long duration = isRefresh ? REFRESHABLE_DURATION : VALID_DURATION;

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getId())
                .issuer("rhythm_of_soul.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(duration, ChronoUnit.SECONDS).toEpochMilli()))
                //                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(account))
                .build();

        JWSObject jwsObject =
                new JWSObject(new JWSHeader(JWSAlgorithm.HS512), new Payload(jwtClaimsSet.toJSONObject()));

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Error signing JWT", e);
        }
    }

    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                        .getJWTClaimsSet()
                        .getIssueTime()
                        .toInstant()
                        .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS)
                        .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    public String buildScope(Account account) {
        return "ROLE_" + account.getRole().name();
    }

    public String getAccountInContext() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
