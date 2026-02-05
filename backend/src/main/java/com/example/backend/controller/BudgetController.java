package com.example.backend.controller;

import com.example.backend.dto.budget.BudgetCreateDTO;
import com.example.backend.dto.budget.BudgetResponseDTO;
import com.example.backend.dto.budget.BudgetUpdateDTO;
import com.example.backend.service.BudgetService;
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
@RequestMapping("/api/budgets")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<BudgetResponseDTO> create(
            @RequestParam String userId,
            @Valid @RequestBody BudgetCreateDTO dto
    ) {
        return ResponseEntity.ok(budgetService.save(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponseDTO> update(
            @PathVariable String id,
            @Valid @RequestBody BudgetUpdateDTO dto
    ) {
        return ResponseEntity.ok(budgetService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponseDTO> getById(@PathVariable String id) {
        return budgetService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponseDTO>> getAll() {
        return ResponseEntity.ok(budgetService.findAll());
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<BudgetResponseDTO>> getByUser(@RequestParam String userId) {
        return ResponseEntity.ok(budgetService.findByUserId(userId));
    }

    @GetMapping("/by-user-month-year")
    public ResponseEntity<BudgetResponseDTO> getByUserMonthYear(
            @RequestParam String userId,
            @RequestParam Integer month,
            @RequestParam Integer year
    ) {
        return budgetService.findByUserIdAndMonthAndYear(userId, month, year)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-user-category")
    public ResponseEntity<List<BudgetResponseDTO>> getByUserCategory(
            @RequestParam String userId,
            @RequestParam String categoryId
    ) {
        return ResponseEntity.ok(budgetService.findByUserIdAndCategoryId(userId, categoryId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        budgetService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
