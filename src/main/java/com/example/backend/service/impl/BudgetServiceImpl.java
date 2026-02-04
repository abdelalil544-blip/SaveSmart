package com.example.backend.service.impl;

import com.example.backend.Entity.Budget;
import com.example.backend.Entity.Category;
import com.example.backend.Entity.User;
import com.example.backend.dto.budget.BudgetCreateDTO;
import com.example.backend.dto.budget.BudgetResponseDTO;
import com.example.backend.dto.budget.BudgetUpdateDTO;
import com.example.backend.mapper.BudgetMapper;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.BudgetService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetMapper budgetMapper;

    public BudgetServiceImpl(
            BudgetRepository budgetRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            BudgetMapper budgetMapper
    ) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.budgetMapper = budgetMapper;
    }

    @Override
    public BudgetResponseDTO save(String userId, BudgetCreateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Category category = null;
        if (dto.getCategoryId() != null && !dto.getCategoryId().isBlank()) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
        }

        Budget budget = budgetMapper.toEntity(dto);
        budget.setUser(user);
        budget.setCategory(category);
        Budget saved = budgetRepository.save(budget);
        return budgetMapper.toResponseDTO(saved);
    }

    @Override
    public BudgetResponseDTO update(String id, BudgetUpdateDTO dto) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found: " + id));
        if (dto.getBudgetAmount() != null) {
            budget.setBudgetAmount(dto.getBudgetAmount());
        }
        if (dto.getMonth() != null) {
            budget.setMonth(dto.getMonth());
        }
        if (dto.getYear() != null) {
            budget.setYear(dto.getYear());
        }
        if (dto.getIsGlobal() != null) {
            budget.setIsGlobal(dto.getIsGlobal());
            if (dto.getIsGlobal()) {
                budget.setCategory(null);
            }
        }
        if (dto.getCategoryId() != null) {
            if (dto.getCategoryId().isBlank()) {
                budget.setCategory(null);
            } else {
                Category category = categoryRepository.findById(dto.getCategoryId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
                budget.setCategory(category);
            }
        }
        Budget saved = budgetRepository.save(budget);
        return budgetMapper.toResponseDTO(saved);
    }

    @Override
    public Optional<BudgetResponseDTO> findById(String id) {
        return budgetRepository.findById(id).map(budgetMapper::toResponseDTO);
    }

    @Override
    public List<BudgetResponseDTO> findAll() {
        return budgetRepository.findAll().stream()
                .map(budgetMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void deleteById(String id) {
        budgetRepository.deleteById(id);
    }

    @Override
    public List<BudgetResponseDTO> findByUserId(String userId) {
        return budgetRepository.findByUserId(userId).stream()
                .map(budgetMapper::toResponseDTO)
                .toList();
    }

    @Override
    public Optional<BudgetResponseDTO> findByUserIdAndMonthAndYear(String userId, Integer month, Integer year) {
        return budgetRepository.findByUserIdAndMonthAndYear(userId, month, year)
                .map(budgetMapper::toResponseDTO);
    }

    @Override
    public List<BudgetResponseDTO> findByUserIdAndCategoryId(String userId, String categoryId) {
        return budgetRepository.findByUserIdAndCategoryId(userId, categoryId).stream()
                .map(budgetMapper::toResponseDTO)
                .toList();
    }
}
