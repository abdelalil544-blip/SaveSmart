package com.example.backend.service.impl;

import com.example.backend.Entity.Category;
import com.example.backend.Entity.Income;
import com.example.backend.Entity.User;
import com.example.backend.dto.income.IncomeCreateDTO;
import com.example.backend.dto.income.IncomeResponseDTO;
import com.example.backend.dto.income.IncomeUpdateDTO;
import com.example.backend.dto.income.MonthlyIncomeResponseDTO;
import com.example.backend.exception.BadRequestException;
import com.example.backend.mapper.IncomeMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IncomeServiceImplTest {

    @Mock
    private IncomeRepository incomeRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private IncomeMapper incomeMapper;

    @InjectMocks
    private IncomeServiceImpl incomeService;

    @Test
    void save_setsUserAndCategoryAndReturnsResponse() {
        User user = new User();
        user.setId("u1");
        Category category = new Category();
        category.setId("c1");
        IncomeCreateDTO dto = new IncomeCreateDTO();
        dto.setAmount(BigDecimal.TEN);
        dto.setDate(LocalDate.now());
        dto.setCategoryId("c1");

        Income income = new Income();
        IncomeResponseDTO response = new IncomeResponseDTO();

        when(userRepository.findById("u1")).thenReturn(Optional.of(user));
        when(categoryRepository.findById("c1")).thenReturn(Optional.of(category));
        when(incomeMapper.toEntity(dto)).thenReturn(income);
        when(incomeRepository.save(income)).thenReturn(income);
        when(incomeMapper.toResponseDTO(income)).thenReturn(response);

        IncomeResponseDTO result = incomeService.save("u1", dto);

        assertSame(user, income.getUser());
        assertSame(category, income.getCategory());
        assertSame(response, result);
    }

    @Test
    void update_blankCategoryId_throwsBadRequest() {
        IncomeUpdateDTO dto = new IncomeUpdateDTO();
        dto.setCategoryId(" ");

        when(incomeRepository.findById("i1")).thenReturn(Optional.of(new Income()));

        assertThrows(BadRequestException.class, () -> incomeService.update("i1", dto));
    }

    @Test
    void getMonthlyIncome_invalidMonth_throwsBadRequest() {
        assertThrows(BadRequestException.class, () -> incomeService.getMonthlyIncome("u1", 2026, 0));
    }

    @Test
    void getMonthlyIncome_returnsTotal() {
        LocalDate start = LocalDate.of(2026, 3, 1);
        LocalDate end = LocalDate.of(2026, 3, 31);
        when(incomeRepository.sumByUserIdAndDateBetween("u1", start, end))
                .thenReturn(BigDecimal.valueOf(123.45));

        MonthlyIncomeResponseDTO result = incomeService.getMonthlyIncome("u1", 2026, 3);

        assertEquals(2026, result.getYear());
        assertEquals(3, result.getMonth());
        assertEquals(BigDecimal.valueOf(123.45), result.getTotal());
    }
}
