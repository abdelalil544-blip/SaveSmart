package com.example.backend.controller;

import com.example.backend.Entity.enums.CategoryType;
import com.example.backend.dto.category.CategoryCreateDTO;
import com.example.backend.dto.category.CategoryResponseDTO;
import com.example.backend.dto.category.CategoryUpdateDTO;
import com.example.backend.service.CategoryService;
import jakarta.validation.Valid;
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

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> create(
            @RequestParam String userId,
            @Valid @RequestBody CategoryCreateDTO dto
    ) {
        return ResponseEntity.ok(categoryService.save(userId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> update(
            @PathVariable String id,
            @Valid @RequestBody CategoryUpdateDTO dto
    ) {
        return ResponseEntity.ok(categoryService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getById(@PathVariable String id) {
        return categoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<CategoryResponseDTO>> getByUser(@RequestParam String userId) {
        return ResponseEntity.ok(categoryService.findByUserId(userId));
    }

    @GetMapping("/by-user-type")
    public ResponseEntity<List<CategoryResponseDTO>> getByUserType(
            @RequestParam String userId,
            @RequestParam CategoryType type
    ) {
        return ResponseEntity.ok(categoryService.findByUserIdAndType(userId, type));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
