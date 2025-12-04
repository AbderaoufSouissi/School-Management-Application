package com.ars.backend.service.impl;

import com.ars.backend.dto.AuthRequest;
import com.ars.backend.dto.AuthResponse;
import com.ars.backend.entity.Admin;
import com.ars.backend.exception.DuplicateResourceException;
import com.ars.backend.repository.AdminRepository;
import com.ars.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceImplTest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private AuthRequest authRequest;
    private Admin admin;
    private String token;

    @BeforeEach
    void setUp() {
        authRequest = new AuthRequest("testuser", "password123");
        admin = Admin.builder()
                .id(1L)
                .username("testuser")
                .password("encodedPassword")
                .build();
        token = "jwt.token.here";
    }

    @Test
    @DisplayName("Should successfully register a new admin")
    void register_Success() {
        // Given
        when(adminRepository.existsByUsername(authRequest.username())).thenReturn(false);
        when(passwordEncoder.encode(authRequest.password())).thenReturn("encodedPassword");
        when(adminRepository.save(any(Admin.class))).thenReturn(admin);
        when(jwtTokenProvider.generateToken(any(Admin.class))).thenReturn(token);

        // When
        AuthResponse response = authService.register(authRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo(token);
        verify(adminRepository).existsByUsername(authRequest.username());
        verify(passwordEncoder).encode(authRequest.password());
        verify(adminRepository).save(any(Admin.class));
        verify(jwtTokenProvider).generateToken(any(Admin.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when username already exists during registration")
    void register_UsernameExists_ThrowsException() {
        // Given
        when(adminRepository.existsByUsername(authRequest.username())).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> authService.register(authRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Admin with username '" + authRequest.username() + "' already exists");

        verify(adminRepository).existsByUsername(authRequest.username());
        verify(passwordEncoder, never()).encode(anyString());
        verify(adminRepository, never()).save(any(Admin.class));
        verify(jwtTokenProvider, never()).generateToken(any(Admin.class));
    }

    @Test
    @DisplayName("Should successfully login with valid credentials")
    void login_Success() {
        // Given
        when(adminRepository.findByUsername(authRequest.username())).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches(authRequest.password(), admin.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateToken(admin)).thenReturn(token);

        // When
        AuthResponse response = authService.login(authRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo(token);
        verify(adminRepository).findByUsername(authRequest.username());
        verify(passwordEncoder).matches(authRequest.password(), admin.getPassword());
        verify(jwtTokenProvider).generateToken(admin);
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when username not found during login")
    void login_UsernameNotFound_ThrowsException() {
        // Given
        when(adminRepository.findByUsername(authRequest.username())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> authService.login(authRequest))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Invalid username or password");

        verify(adminRepository).findByUsername(authRequest.username());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtTokenProvider, never()).generateToken(any(Admin.class));
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when password is incorrect during login")
    void login_IncorrectPassword_ThrowsException() {
        // Given
        when(adminRepository.findByUsername(authRequest.username())).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches(authRequest.password(), admin.getPassword())).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> authService.login(authRequest))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Invalid username or password");

        verify(adminRepository).findByUsername(authRequest.username());
        verify(passwordEncoder).matches(authRequest.password(), admin.getPassword());
        verify(jwtTokenProvider, never()).generateToken(any(Admin.class));
    }

    @Test
    @DisplayName("Should encode password when registering admin")
    void register_ShouldEncodePassword() {
        // Given
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword123";
        AuthRequest request = new AuthRequest("newuser", rawPassword);

        when(adminRepository.existsByUsername(request.username())).thenReturn(false);
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(adminRepository.save(any(Admin.class))).thenReturn(admin);
        when(jwtTokenProvider.generateToken(any(Admin.class))).thenReturn(token);

        // When
        authService.register(request);

        // Then
        verify(passwordEncoder).encode(rawPassword);
        verify(adminRepository).save(argThat(savedAdmin ->
            savedAdmin.getUsername().equals(request.username()) &&
            savedAdmin.getPassword().equals(encodedPassword)
        ));
    }

    @Test
    @DisplayName("Should return JWT token after successful registration")
    void register_ShouldReturnJwtToken() {
        // Given
        String expectedToken = "expected.jwt.token";
        when(adminRepository.existsByUsername(authRequest.username())).thenReturn(false);
        when(passwordEncoder.encode(authRequest.password())).thenReturn("encodedPassword");
        when(adminRepository.save(any(Admin.class))).thenReturn(admin);
        when(jwtTokenProvider.generateToken(admin)).thenReturn(expectedToken);

        // When
        AuthResponse response = authService.register(authRequest);

        // Then
        assertThat(response.accessToken()).isEqualTo(expectedToken);
    }

    @Test
    @DisplayName("Should return JWT token after successful login")
    void login_ShouldReturnJwtToken() {
        // Given
        String expectedToken = "expected.jwt.token";
        when(adminRepository.findByUsername(authRequest.username())).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches(authRequest.password(), admin.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateToken(admin)).thenReturn(expectedToken);

        // When
        AuthResponse response = authService.login(authRequest);

        // Then
        assertThat(response.accessToken()).isEqualTo(expectedToken);
    }
}


