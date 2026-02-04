package com.example.backend.service.impl;

import com.example.backend.Entity.Category;
import com.example.backend.Entity.Income;
import com.example.backend.Entity.User;
import com.example.backend.dto.income.IncomeCreateDTO;
import com.example.backend.dto.income.IncomeResponseDTO;
import com.example.backend.mapper.IncomeMapper;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.IncomeService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final IncomeMapper incomeMapper;

    public IncomeServiceImpl(
            IncomeRepository incomeRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            IncomeMapper incomeMapper
    ) {
        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.incomeMapper = incomeMapper;
    }

    @Override
    public IncomeResponseDTO save(String userId, IncomeCreateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
        Income income = incomeMapper.toEntity(dto);
        income.setUser(user);
        income.setCategory(category);
        Income saved = incomeRepository.save(income);
        return incomeMapper.toResponseDTO(saved);
    }

    @Override
    public Optional<IncomeResponseDTO> findById(String id) {
        return incomeRepository.findById(id).map(incomeMapper::toResponseDTO);
    }

    @Override
    public List<IncomeResponseDTO> findAll() {
        return incomeRepository.findAll().stream()
                .map(incomeMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void deleteById(String id) {
        incomeRepository.deleteById(id);
    }

    @Override
    public List<IncomeResponseDTO> findByUserId(String userId) {
        return incomeRepository.findByUserId(userId).stream()
                .map(incomeMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<IncomeResponseDTO> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate) {
        return incomeRepository.findByUserIdAndDateBetween(userId, startDate, endDate).stream()
                .map(incomeMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<IncomeResponseDTO> findByUserIdAndCategoryId(String userId, String categoryId) {
        return incomeRepository.findByUserIdAndCategoryId(userId, categoryId).stream()
                .map(incomeMapper::toResponseDTO)
                .toList();
    }
}
