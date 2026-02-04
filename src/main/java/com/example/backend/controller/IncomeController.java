package com.example.backend.controller;

import com.example.backend.dto.income.IncomeCreateDTO;
import com.example.backend.dto.income.IncomeResponseDTO;
import com.example.backend.dto.income.IncomeUpdateDTO;
import com.example.backend.service.IncomeService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @PostMapping
    public ResponseEntity<IncomeResponseDTO> create(
            @RequestParam String userId,
            @Valid @RequestBody IncomeCreateDTO dto
    ) {
        return ResponseEntity.ok(incomeService.save(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponseDTO> update(
            @PathVariable String id,
            @Valid @RequestBody IncomeUpdateDTO dto
    ) {
        return ResponseEntity.ok(incomeService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeResponseDTO> getById(@PathVariable String id) {
        return incomeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<IncomeResponseDTO>> getAll() {
        return ResponseEntity.ok(incomeService.findAll());
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<IncomeResponseDTO>> getByUser(@RequestParam String userId) {
        return ResponseEntity.ok(incomeService.findByUserId(userId));
    }

    @GetMapping("/by-user-date")
    public ResponseEntity<List<IncomeResponseDTO>> getByUserDateBetween(
            @RequestParam String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return ResponseEntity.ok(incomeService.findByUserIdAndDateBetween(userId, start, end));
    }

    @GetMapping("/by-user-category")
    public ResponseEntity<List<IncomeResponseDTO>> getByUserCategory(
            @RequestParam String userId,
            @RequestParam String categoryId
    ) {
        return ResponseEntity.ok(incomeService.findByUserIdAndCategoryId(userId, categoryId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        incomeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
