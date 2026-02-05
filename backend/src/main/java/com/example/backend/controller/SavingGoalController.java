package com.example.backend.controller;

import com.example.backend.Entity.enums.GoalStatus;
import com.example.backend.dto.savinggoal.GoalProgressResponseDTO;
import com.example.backend.dto.savinggoal.SavingGoalCreateDTO;
import com.example.backend.dto.savinggoal.SavingGoalResponseDTO;
import com.example.backend.dto.savinggoal.SavingGoalUpdateDTO;
import com.example.backend.service.SavingGoalService;
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
@RequestMapping("/api/saving-goals")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class SavingGoalController {

    private final SavingGoalService savingGoalService;

    public SavingGoalController(SavingGoalService savingGoalService) {
        this.savingGoalService = savingGoalService;
    }

    @PostMapping
    public ResponseEntity<SavingGoalResponseDTO> create(
            @RequestParam String userId,
            @Valid @RequestBody SavingGoalCreateDTO dto
    ) {
        return ResponseEntity.ok(savingGoalService.save(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingGoalResponseDTO> update(
            @PathVariable String id,
            @Valid @RequestBody SavingGoalUpdateDTO dto
    ) {
        return ResponseEntity.ok(savingGoalService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavingGoalResponseDTO> getById(@PathVariable String id) {
        return savingGoalService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<SavingGoalResponseDTO>> getAll() {
        return ResponseEntity.ok(savingGoalService.findAll());
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<SavingGoalResponseDTO>> getByUser(@RequestParam String userId) {
        return ResponseEntity.ok(savingGoalService.findByUserId(userId));
    }

    @GetMapping("/by-user-status")
    public ResponseEntity<List<SavingGoalResponseDTO>> getByUserStatus(
            @RequestParam String userId,
            @RequestParam GoalStatus status
    ) {
        return ResponseEntity.ok(savingGoalService.findByUserIdAndStatus(userId, status));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<GoalProgressResponseDTO> getProgress(@PathVariable String id) {
        return ResponseEntity.ok(savingGoalService.getGoalProgress(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        savingGoalService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
