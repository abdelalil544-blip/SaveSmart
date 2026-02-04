package com.example.backend.controller;

import com.example.backend.dto.expense.ExpenseCreateDTO;
import com.example.backend.dto.expense.ExpenseResponseDTO;
import com.example.backend.dto.expense.ExpenseUpdateDTO;
import com.example.backend.service.ExpenseService;
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
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponseDTO> create(
            @RequestParam String userId,
            @Valid @RequestBody ExpenseCreateDTO dto
    ) {
        return ResponseEntity.ok(expenseService.save(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> update(
            @PathVariable String id,
            @Valid @RequestBody ExpenseUpdateDTO dto
    ) {
        return ResponseEntity.ok(expenseService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponseDTO> getById(@PathVariable String id) {
        return expenseService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponseDTO>> getAll() {
        return ResponseEntity.ok(expenseService.findAll());
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<ExpenseResponseDTO>> getByUser(@RequestParam String userId) {
        return ResponseEntity.ok(expenseService.findByUserId(userId));
    }

    @GetMapping("/by-user-date")
    public ResponseEntity<List<ExpenseResponseDTO>> getByUserDateBetween(
            @RequestParam String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return ResponseEntity.ok(expenseService.findByUserIdAndDateBetween(userId, start, end));
    }

    @GetMapping("/by-user-category")
    public ResponseEntity<List<ExpenseResponseDTO>> getByUserCategory(
            @RequestParam String userId,
            @RequestParam String categoryId
    ) {
        return ResponseEntity.ok(expenseService.findByUserIdAndCategoryId(userId, categoryId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        expenseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
