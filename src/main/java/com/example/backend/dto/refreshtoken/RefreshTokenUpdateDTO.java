package com.example.backend.dto.refreshtoken;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RefreshTokenUpdateDTO {

    @NotBlank(message = "Token must not be blank")
    private String token;

    private LocalDateTime expiryDate;
}
