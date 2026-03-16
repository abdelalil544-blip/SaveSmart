package com.example.backend.dto.user;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordDTO {
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}
