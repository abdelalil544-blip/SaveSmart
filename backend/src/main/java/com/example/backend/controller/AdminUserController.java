package com.example.backend.controller;

import com.example.backend.dto.user.ResetPasswordDTO;
import com.example.backend.dto.user.UserResponseDTO;
import com.example.backend.dto.user.UserStatsDTO;
import com.example.backend.dto.user.UserUpdateDTO;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> list(@RequestParam(required = false) String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.ok(userService.findAll());
        }
        String q = query.trim().toLowerCase();
        List<UserResponseDTO> filtered = userService.findAll().stream()
                .filter(u -> (u.getEmail() != null && u.getEmail().toLowerCase().contains(q))
                        || (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(q))
                        || (u.getLastName() != null && u.getLastName().toLowerCase().contains(q)))
                .toList();
        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable String id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<UserStatsDTO> getStats(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserStats(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> update(@PathVariable String id, @Valid @RequestBody UserUpdateDTO dto) {
        return ResponseEntity.ok(userService.update(id, dto));
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<UserResponseDTO> resetPassword(@PathVariable String id, @Valid @RequestBody ResetPasswordDTO dto) {
        return ResponseEntity.ok(userService.resetPassword(id, dto.getPassword()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
