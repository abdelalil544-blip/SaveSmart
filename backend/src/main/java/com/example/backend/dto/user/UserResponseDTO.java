package com.example.backend.dto.user;

import com.example.backend.Entity.enums.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDTO {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Boolean active;
    private Role role;
    private LocalDateTime createdAt;
}
