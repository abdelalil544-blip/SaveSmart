package com.example.backend.service;

import com.example.backend.dto.user.UserCreateDTO;
import com.example.backend.dto.user.UserResponseDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserResponseDTO save(UserCreateDTO dto);

    Optional<UserResponseDTO> findById(String id);

    List<UserResponseDTO> findAll();

    void deleteById(String id);

    Optional<UserResponseDTO> findByEmail(String email);

    boolean existsByEmail(String email);
}
