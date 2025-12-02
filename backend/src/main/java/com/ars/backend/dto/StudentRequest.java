package com.ars.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.ars.backend.enumeration.Level;

public record StudentRequest(
        @NotNull(message = "Level is required")
        Level level,
        @NotBlank(message = "Username is required")
        String username
) {}
