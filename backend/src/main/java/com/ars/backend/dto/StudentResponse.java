package com.ars.backend.dto;

import com.ars.backend.enumeration.Level;

public record StudentResponse(
        Long id,
        String username,
        Level level
) {}
