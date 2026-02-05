package com.example.backend.dto.refreshtoken;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RefreshTokenResponseDTO {

    private String id;
    private String token;
    private LocalDateTime expiryDate;
    private String userId;
    private LocalDateTime createdAt;
}
