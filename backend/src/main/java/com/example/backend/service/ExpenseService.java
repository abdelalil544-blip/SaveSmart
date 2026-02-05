package com.example.backend.service;

import com.example.backend.dto.expense.ExpenseCreateDTO;
import com.example.backend.dto.expense.ExpenseResponseDTO;
import com.example.backend.dto.expense.ExpenseUpdateDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseService {
    ExpenseResponseDTO save(String userId, ExpenseCreateDTO dto);

    ExpenseResponseDTO update(String id, ExpenseUpdateDTO dto);

    Optional<ExpenseResponseDTO> findById(String id);

    List<ExpenseResponseDTO> findAll();

    void deleteById(String id);

    List<ExpenseResponseDTO> findByUserId(String userId);

    List<ExpenseResponseDTO> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    List<ExpenseResponseDTO> findByUserIdAndCategoryId(String userId, String categoryId);
}
