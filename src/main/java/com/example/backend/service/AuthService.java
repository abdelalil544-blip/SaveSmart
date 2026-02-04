package com.example.backend.service;

import com.example.backend.dto.auth.AuthResponseDTO;
import com.example.backend.dto.auth.LoginRequestDTO;
import com.example.backend.dto.user.UserCreateDTO;

public interface AuthService {

    AuthResponseDTO register(UserCreateDTO dto);

    AuthResponseDTO login(LoginRequestDTO dto);

    AuthResponseDTO refresh(String refreshToken);
}
