package com.example.backend.service.impl;

import com.example.backend.Entity.Category;
import com.example.backend.Entity.Expense;
import com.example.backend.Entity.User;
import com.example.backend.dto.expense.ExpenseCreateDTO;
import com.example.backend.dto.expense.ExpenseResponseDTO;
import com.example.backend.mapper.ExpenseMapper;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ExpenseService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseServiceImpl(
            ExpenseRepository expenseRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ExpenseMapper expenseMapper
    ) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.expenseMapper = expenseMapper;
    }

    @Override
    public ExpenseResponseDTO save(String userId, ExpenseCreateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.getCategoryId()));
        Expense expense = expenseMapper.toEntity(dto);
        expense.setUser(user);
        expense.setCategory(category);
        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toResponseDTO(saved);
    }

    @Override
    public Optional<ExpenseResponseDTO> findById(String id) {
        return expenseRepository.findById(id).map(expenseMapper::toResponseDTO);
    }

    @Override
    public List<ExpenseResponseDTO> findAll() {
        return expenseRepository.findAll().stream()
                .map(expenseMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void deleteById(String id) {
        expenseRepository.deleteById(id);
    }

    @Override
    public List<ExpenseResponseDTO> findByUserId(String userId) {
        return expenseRepository.findByUserId(userId).stream()
                .map(expenseMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<ExpenseResponseDTO> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate).stream()
                .map(expenseMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<ExpenseResponseDTO> findByUserIdAndCategoryId(String userId, String categoryId) {
        return expenseRepository.findByUserIdAndCategoryId(userId, categoryId).stream()
                .map(expenseMapper::toResponseDTO)
                .toList();
    }
}
