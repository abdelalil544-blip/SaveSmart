package com.example.backend.dto.refreshtoken;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RefreshTokenCreateDTO {

    @NotBlank(message = "Token is required")
    private String token;

    @NotNull(message = "Expiry date is required")
    private LocalDateTime expiryDate;
}
