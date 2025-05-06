package com.rhythm_of_soul.identity_service.utils;

import com.rhythm_of_soul.identity_service.constant.SecurityConstants;
import com.rhythm_of_soul.identity_service.exception.AppException;
import com.rhythm_of_soul.identity_service.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class OtpUtils {
    StringRedisTemplate stringRedisTemplate;

    private static final String OTP_CHARACTERS = "0123456789";
    private static final int OTP_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    private static final int OTP_TTL_MIN = 5;

    /**
     * Send otp when sign up or reset pass
     * type: VERIFY_OTP, RESET
     */
    @Async("taskExecutor")
    public void send(String type, String email){
        try {
            String key = "OTP_" + type + "_" + email;
            String otp = generateOtp();

            stringRedisTemplate.opsForValue().set(key, otp);
            stringRedisTemplate.expire(key, OTP_TTL_MIN, TimeUnit.MINUTES);

            // Publisher send email
            stringRedisTemplate.opsForStream().add(SecurityConstants.STREAM_KEY, Map.of(email, otp));
        }
        catch (Exception e){
            throw new AppException(ErrorCode.ERROR_SEND_OTP);
        }
    }

    /**
     * Verify otp in server
     */
    public boolean verify(String type, String email, String otp){
        String key = "OTP_" + type+ "_" + email;
        String otpStored = stringRedisTemplate.opsForValue().get(key);
        if(otpStored == null)
            throw new AppException(ErrorCode.INVALID_OTP);
        if (otpStored.equals(otp)) {
            stringRedisTemplate.delete(key);
            return true;
        }
        return false;
    }

    /**
     * Gen random otp
     * @return otp
     */
    private String generateOtp(){
        StringBuilder otp = new StringBuilder(OTP_LENGTH);
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(OTP_CHARACTERS.charAt(random.nextInt(OTP_CHARACTERS.length())));
        }
        return otp.toString();
    }
}

