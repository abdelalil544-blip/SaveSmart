package com.example.backend.service.impl;

import com.example.backend.Entity.Category;
import com.example.backend.Entity.Income;
import com.example.backend.Entity.User;
import com.example.backend.dto.income.IncomeCreateDTO;
import com.example.backend.dto.income.IncomeResponseDTO;
import com.example.backend.dto.income.IncomeUpdateDTO;
import com.example.backend.dto.income.MonthlyIncomeResponseDTO;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.IncomeMapper;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.IncomeService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.math.BigDecimal;
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
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));
        Income income = incomeMapper.toEntity(dto);
        income.setUser(user);
        income.setCategory(category);
        Income saved = incomeRepository.save(income);
        return incomeMapper.toResponseDTO(saved);
    }

    @Override
    public IncomeResponseDTO update(String id, IncomeUpdateDTO dto) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found: " + id));
        if (dto.getAmount() != null) {
            income.setAmount(dto.getAmount());
        }
        if (dto.getDate() != null) {
            income.setDate(dto.getDate());
        }
        if (dto.getDescription() != null) {
            income.setDescription(dto.getDescription());
        }
        if (dto.getCategoryId() != null) {
            if (dto.getCategoryId().isBlank()) {
                throw new BadRequestException("Category id must not be blank");
            }
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));
            income.setCategory(category);
        }
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

    @Override
    public MonthlyIncomeResponseDTO getMonthlyIncome(String userId, int year, int month) {
        if (month < 1 || month > 12) {
            throw new BadRequestException("Month must be between 1 and 12");
        }
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        BigDecimal total = incomeRepository.sumByUserIdAndDateBetween(userId, start, end);

        MonthlyIncomeResponseDTO response = new MonthlyIncomeResponseDTO();
        response.setYear(year);
        response.setMonth(month);
        response.setTotal(total);
        return response;
    }
}
