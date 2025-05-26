package com.Group11.reno_connect.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.security.Key;

@Configuration
public class JwtConfig {

    @Bean
    public Key jwtSecret() {
        return Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
    }
} 