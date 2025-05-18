package com.rhythm_of_soul.notification_service.util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class AESUtil {
  private static final String ALGORITHM = "AES";

  public static SecretKey generateKey() throws Exception {
    KeyGenerator keyGen = KeyGenerator.getInstance(ALGORITHM);
    keyGen.init(128); // AES 256-bit
    return keyGen.generateKey();
  }

  public static SecretKey decodeKeyFromBase64(String base64Key) {
    byte[] decodedKey = Base64.getDecoder().decode(base64Key);
    return new SecretKeySpec(decodedKey, 0, decodedKey.length, ALGORITHM);
  }

  public static String encrypt(String data, SecretKey secretKey) throws Exception {
    Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
    cipher.init(Cipher.ENCRYPT_MODE, secretKey);
    byte[] encrypted = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
    return Base64.getEncoder().encodeToString(encrypted);
  }

  public static String decrypt(String encryptedData, SecretKey secretKey) throws Exception {
    Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
    cipher.init(Cipher.DECRYPT_MODE, secretKey);
    byte[] decoded = Base64.getDecoder().decode(encryptedData);
    byte[] decrypted = cipher.doFinal(decoded);
    return new String(decrypted, StandardCharsets.UTF_8);
  }

}
