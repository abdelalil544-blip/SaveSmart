package com.example.backend.service.impl;

import com.example.backend.Entity.RefreshToken;
import com.example.backend.Entity.User;
import com.example.backend.Entity.enums.Role;
import com.example.backend.dto.auth.AuthResponseDTO;
import com.example.backend.dto.auth.LoginRequestDTO;
import com.example.backend.dto.user.UserCreateDTO;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    public AuthServiceImpl(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
    }

    @Override
    public AuthResponseDTO register(UserCreateDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.ROLE_USER);
        user.setActive(true);
        User saved = userRepository.save(user);

        String accessToken = jwtService.generateToken(saved);
        String refreshToken = createRefreshToken(saved);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(userMapper.toResponseDTO(saved));
        return response;
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String accessToken = jwtService.generateToken(user);
        refreshTokenRepository.deleteByUserId(user.getId());
        String refreshToken = createRefreshToken(user);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(userMapper.toResponseDTO(user));
        return response;
    }

    @Override
    public AuthResponseDTO refresh(String refreshToken) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.deleteById(token.getId());
            throw new IllegalArgumentException("Refresh token expired");
        }

        User user = token.getUser();
        String accessToken = jwtService.generateToken(user);
        refreshTokenRepository.deleteById(token.getId());
        String newRefreshToken = createRefreshToken(user);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setAccessToken(accessToken);
        response.setRefreshToken(newRefreshToken);
        response.setUser(userMapper.toResponseDTO(user));
        return response;
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(token -> refreshTokenRepository.deleteById(token.getId()));
    }

    private String createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(LocalDateTime.now().plus(Duration.ofMillis(refreshExpirationMs)));
        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        return saved.getToken();
    }
}
