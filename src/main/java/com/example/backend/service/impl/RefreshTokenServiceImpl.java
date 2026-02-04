package com.example.backend.service.impl;

import com.example.backend.Entity.RefreshToken;
import com.example.backend.Entity.User;
import com.example.backend.dto.refreshtoken.RefreshTokenCreateDTO;
import com.example.backend.dto.refreshtoken.RefreshTokenResponseDTO;
import com.example.backend.dto.refreshtoken.RefreshTokenUpdateDTO;
import com.example.backend.mapper.RefreshTokenMapper;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.RefreshTokenService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final RefreshTokenMapper refreshTokenMapper;

    public RefreshTokenServiceImpl(
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            RefreshTokenMapper refreshTokenMapper
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.refreshTokenMapper = refreshTokenMapper;
    }

    @Override
    public RefreshTokenResponseDTO save(String userId, RefreshTokenCreateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        RefreshToken refreshToken = refreshTokenMapper.toEntity(dto);
        refreshToken.setUser(user);
        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        return refreshTokenMapper.toResponseDTO(saved);
    }

    @Override
    public RefreshTokenResponseDTO update(String id, RefreshTokenUpdateDTO dto) {
        RefreshToken refreshToken = refreshTokenRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found: " + id));
        if (dto.getToken() != null) {
            refreshToken.setToken(dto.getToken());
        }
        if (dto.getExpiryDate() != null) {
            refreshToken.setExpiryDate(dto.getExpiryDate());
        }
        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        return refreshTokenMapper.toResponseDTO(saved);
    }

    @Override
    public Optional<RefreshTokenResponseDTO> findById(String id) {
        return refreshTokenRepository.findById(id).map(refreshTokenMapper::toResponseDTO);
    }

    @Override
    public List<RefreshTokenResponseDTO> findAll() {
        return refreshTokenRepository.findAll().stream()
                .map(refreshTokenMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void deleteById(String id) {
        refreshTokenRepository.deleteById(id);
    }

    @Override
    public Optional<RefreshTokenResponseDTO> findByToken(String token) {
        return refreshTokenRepository.findByToken(token).map(refreshTokenMapper::toResponseDTO);
    }

    @Override
    public void deleteByUserId(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
}
