package com.example.backend.service.impl;

import com.example.backend.Entity.Category;
import com.example.backend.Entity.Expense;
import com.example.backend.Entity.User;
import com.example.backend.dto.expense.ExpenseCreateDTO;
import com.example.backend.dto.expense.ExpenseResponseDTO;
import com.example.backend.dto.expense.ExpenseUpdateDTO;
import com.example.backend.exception.BadRequestException;
import com.example.backend.mapper.ExpenseMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceImplTest {

    @Mock
    private ExpenseRepository expenseRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private ExpenseMapper expenseMapper;

    @InjectMocks
    private ExpenseServiceImpl expenseService;

    @Test
    void save_setsUserAndCategoryAndReturnsResponse() {
        User user = new User();
        user.setId("u1");
        Category category = new Category();
        category.setId("c1");
        ExpenseCreateDTO dto = new ExpenseCreateDTO();
        dto.setAmount(BigDecimal.TEN);
        dto.setDate(LocalDate.now());
        dto.setCategoryId("c1");

        Expense expense = new Expense();
        ExpenseResponseDTO response = new ExpenseResponseDTO();

        when(userRepository.findById("u1")).thenReturn(Optional.of(user));
        when(categoryRepository.findById("c1")).thenReturn(Optional.of(category));
        when(expenseMapper.toEntity(dto)).thenReturn(expense);
        when(expenseRepository.save(expense)).thenReturn(expense);
        when(expenseMapper.toResponseDTO(expense)).thenReturn(response);

        ExpenseResponseDTO result = expenseService.save("u1", dto);

        assertSame(user, expense.getUser());
        assertSame(category, expense.getCategory());
        assertSame(response, result);
    }

    @Test
    void update_blankCategoryId_throwsBadRequest() {
        ExpenseUpdateDTO dto = new ExpenseUpdateDTO();
        dto.setCategoryId(" ");

        when(expenseRepository.findById("e1")).thenReturn(Optional.of(new Expense()));

        assertThrows(BadRequestException.class, () -> expenseService.update("e1", dto));
    }

    @Test
    void findByUserIdAndDateBetween_delegatesToRepository() {
        LocalDate start = LocalDate.of(2026, 1, 1);
        LocalDate end = LocalDate.of(2026, 1, 31);
        when(expenseRepository.findByUserIdAndDateBetween("u1", start, end))
                .thenReturn(List.of());

        expenseService.findByUserIdAndDateBetween("u1", start, end);

        verify(expenseRepository).findByUserIdAndDateBetween("u1", start, end);
    }
}
