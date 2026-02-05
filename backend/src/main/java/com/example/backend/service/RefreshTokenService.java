package com.example.backend.service;

import com.example.backend.dto.refreshtoken.RefreshTokenCreateDTO;
import com.example.backend.dto.refreshtoken.RefreshTokenResponseDTO;
import com.example.backend.dto.refreshtoken.RefreshTokenUpdateDTO;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenService {
    RefreshTokenResponseDTO save(String userId, RefreshTokenCreateDTO dto);

    RefreshTokenResponseDTO update(String id, RefreshTokenUpdateDTO dto);

    Optional<RefreshTokenResponseDTO> findById(String id);

    List<RefreshTokenResponseDTO> findAll();

    void deleteById(String id);

    Optional<RefreshTokenResponseDTO> findByToken(String token);

    void deleteByUserId(String userId);
}
