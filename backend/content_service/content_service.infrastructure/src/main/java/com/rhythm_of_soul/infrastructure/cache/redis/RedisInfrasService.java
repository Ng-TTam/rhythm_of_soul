package com.rhythm_of_soul.infrastructure.cache.redis;

public interface RedisInfrasService {
    void setString(String key, String value);
    String getString(String key);
}
