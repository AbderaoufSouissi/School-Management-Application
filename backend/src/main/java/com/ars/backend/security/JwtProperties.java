package com.ars.backend.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "security.jwt")
public class JwtProperties {
    /** Secret key for signing tokens */
    private String secret;

    /** Token validity in milliseconds */
    private long expiration;
}

