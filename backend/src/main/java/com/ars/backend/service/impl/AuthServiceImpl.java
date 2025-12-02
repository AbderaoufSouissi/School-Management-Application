package com.ars.backend.service.impl;

import com.ars.backend.dto.AuthRequest;
import com.ars.backend.dto.AuthResponse;
import com.ars.backend.entity.Admin;
import com.ars.backend.exception.DuplicateResourceException;
import com.ars.backend.repository.AdminRepository;
import com.ars.backend.security.JwtTokenProvider;
import com.ars.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse register(AuthRequest request) {
        if (adminRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Admin with username '" + request.username() + "' already exists");
        }

        Admin admin = Admin.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .build();
        Admin savedAdmin = adminRepository.save(admin);

        return new AuthResponse(jwtTokenProvider.generateToken(savedAdmin));
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        Admin admin = adminRepository.findByUsername(request.username())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), admin.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        return new AuthResponse(jwtTokenProvider.generateToken(admin));
    }
}

