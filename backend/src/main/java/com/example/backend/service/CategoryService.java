package com.example.backend.service;

import com.example.backend.Entity.enums.CategoryType;
import com.example.backend.dto.category.CategoryCreateDTO;
import com.example.backend.dto.category.CategoryResponseDTO;
import com.example.backend.dto.category.CategoryUpdateDTO;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    CategoryResponseDTO save(String userId, CategoryCreateDTO dto);

    CategoryResponseDTO update(String id, CategoryUpdateDTO dto);

    Optional<CategoryResponseDTO> findById(String id);

    List<CategoryResponseDTO> findAll();

    void deleteById(String id);

    List<CategoryResponseDTO> findByUserId(String userId);

    List<CategoryResponseDTO> findByUserIdAndType(String userId, CategoryType type);
}
