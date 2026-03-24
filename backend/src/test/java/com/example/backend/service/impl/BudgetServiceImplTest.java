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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BudgetServiceImplTest {

    @Mock
    private BudgetRepository budgetRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private BudgetMapper budgetMapper;

    @InjectMocks
    private BudgetServiceImpl budgetService;

    @Test
    void save_setsUserAndCategoryAndReturnsResponse() {
        User user = new User();
        user.setId("u1");
        Category category = new Category();
        category.setId("c1");
        BudgetCreateDTO dto = new BudgetCreateDTO();
        dto.setBudgetAmount(BigDecimal.valueOf(200));
        dto.setMonth(3);
        dto.setYear(2026);
        dto.setCategoryId("c1");

        Budget budget = new Budget();
        BudgetResponseDTO response = new BudgetResponseDTO();

        when(userRepository.findById("u1")).thenReturn(Optional.of(user));
        when(categoryRepository.findById("c1")).thenReturn(Optional.of(category));
        when(budgetMapper.toEntity(dto)).thenReturn(budget);
        when(budgetRepository.save(budget)).thenReturn(budget);
        when(budgetMapper.toResponseDTO(budget)).thenReturn(response);

        BudgetResponseDTO result = budgetService.save("u1", dto);

        assertSame(user, budget.getUser());
        assertSame(category, budget.getCategory());
        assertSame(response, result);
    }

    @Test
    void update_isGlobalTrue_clearsCategory() {
        Budget budget = new Budget();
        budget.setId("b1");
        budget.setCategory(new Category());

        BudgetUpdateDTO dto = new BudgetUpdateDTO();
        dto.setIsGlobal(true);

        when(budgetRepository.findById("b1")).thenReturn(Optional.of(budget));
        when(budgetRepository.save(budget)).thenReturn(budget);
        when(budgetMapper.toResponseDTO(budget)).thenReturn(new BudgetResponseDTO());

        budgetService.update("b1", dto);

        assertTrue(Boolean.TRUE.equals(budget.getIsGlobal()));
        assertNull(budget.getCategory());
    }

    @Test
    void update_blankCategoryId_clearsCategory() {
        Budget budget = new Budget();
        budget.setId("b1");
        budget.setCategory(new Category());

        BudgetUpdateDTO dto = new BudgetUpdateDTO();
        dto.setCategoryId(" ");

        when(budgetRepository.findById("b1")).thenReturn(Optional.of(budget));
        when(budgetRepository.save(budget)).thenReturn(budget);
        when(budgetMapper.toResponseDTO(budget)).thenReturn(new BudgetResponseDTO());

        budgetService.update("b1", dto);

        assertNull(budget.getCategory());
    }

    @Test
    void findByUserIdAndMonthAndYear_delegatesToRepository() {
        budgetService.findByUserIdAndMonthAndYear("u1", 3, 2026);

        verify(budgetRepository).findByUserIdAndMonthAndYear("u1", 3, 2026);
    }
}
