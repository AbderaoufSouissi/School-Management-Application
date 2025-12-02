package com.ars.backend.service;

import com.ars.backend.dto.AuthRequest;
import com.ars.backend.dto.AuthResponse;

public interface AuthService {
    AuthResponse register(AuthRequest request);
    AuthResponse login(AuthRequest request);
}

