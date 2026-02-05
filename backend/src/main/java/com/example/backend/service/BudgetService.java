package com.example.backend.service;

import com.example.backend.dto.budget.BudgetCreateDTO;
import com.example.backend.dto.budget.BudgetResponseDTO;
import com.example.backend.dto.budget.BudgetUpdateDTO;

import java.util.List;
import java.util.Optional;

public interface BudgetService {
    BudgetResponseDTO save(String userId, BudgetCreateDTO dto);

    BudgetResponseDTO update(String id, BudgetUpdateDTO dto);

    Optional<BudgetResponseDTO> findById(String id);

    List<BudgetResponseDTO> findAll();

    void deleteById(String id);

    List<BudgetResponseDTO> findByUserId(String userId);

    Optional<BudgetResponseDTO> findByUserIdAndMonthAndYear(String userId, Integer month, Integer year);

    List<BudgetResponseDTO> findByUserIdAndCategoryId(String userId, String categoryId);
}
