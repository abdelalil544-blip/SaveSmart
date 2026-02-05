package com.example.backend.dto.auth;

import com.example.backend.dto.user.UserResponseDTO;
import lombok.Data;

@Data
public class AuthResponseDTO {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserResponseDTO user;
}
