package com.example.backend.controller;

import com.example.backend.dto.refreshtoken.RefreshTokenCreateDTO;
import com.example.backend.dto.refreshtoken.RefreshTokenResponseDTO;
import com.example.backend.dto.refreshtoken.RefreshTokenUpdateDTO;
import com.example.backend.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/refresh-tokens")
@PreAuthorize("hasRole('ADMIN')")
public class RefreshTokenController {

    private final RefreshTokenService refreshTokenService;

    public RefreshTokenController(RefreshTokenService refreshTokenService) {
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping
    public ResponseEntity<RefreshTokenResponseDTO> create(
            @RequestParam String userId,
            @Valid @RequestBody RefreshTokenCreateDTO dto
    ) {
        return ResponseEntity.ok(refreshTokenService.save(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RefreshTokenResponseDTO> update(
            @PathVariable String id,
            @Valid @RequestBody RefreshTokenUpdateDTO dto
    ) {
        return ResponseEntity.ok(refreshTokenService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RefreshTokenResponseDTO> getById(@PathVariable String id) {
        return refreshTokenService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<RefreshTokenResponseDTO>> getAll() {
        return ResponseEntity.ok(refreshTokenService.findAll());
    }

    @GetMapping("/by-token")
    public ResponseEntity<RefreshTokenResponseDTO> getByToken(@RequestParam String token) {
        return refreshTokenService.findByToken(token)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        refreshTokenService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/by-user")
    public ResponseEntity<Void> deleteByUser(@RequestParam String userId) {
        refreshTokenService.deleteByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}
