package com.example.backend.service;

import com.example.backend.dto.income.IncomeCreateDTO;
import com.example.backend.dto.income.IncomeResponseDTO;
import com.example.backend.dto.income.IncomeUpdateDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IncomeService {
    IncomeResponseDTO save(String userId, IncomeCreateDTO dto);

    IncomeResponseDTO update(String id, IncomeUpdateDTO dto);

    Optional<IncomeResponseDTO> findById(String id);

    List<IncomeResponseDTO> findAll();

    void deleteById(String id);

    List<IncomeResponseDTO> findByUserId(String userId);

    List<IncomeResponseDTO> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    List<IncomeResponseDTO> findByUserIdAndCategoryId(String userId, String categoryId);
}
