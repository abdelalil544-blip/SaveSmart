package com.example.backend.service.impl;

import com.example.backend.Entity.Category;
import com.example.backend.Entity.User;
import com.example.backend.Entity.enums.CategoryType;
import com.example.backend.dto.category.CategoryCreateDTO;
import com.example.backend.dto.category.CategoryResponseDTO;
import com.example.backend.mapper.CategoryMapper;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CategoryMapper categoryMapper;
    @Mock
    private IncomeRepository incomeRepository;
    @Mock
    private ExpenseRepository expenseRepository;
    @Mock
    private BudgetRepository budgetRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Test
    void save_setsUserAndReturnsResponse() {
        User user = new User();
        user.setId("u1");
        CategoryCreateDTO dto = new CategoryCreateDTO();
        dto.setName("Food");
        dto.setType(CategoryType.EXPENSE);

        Category category = new Category();
        CategoryResponseDTO response = new CategoryResponseDTO();

        when(userRepository.findById("u1")).thenReturn(Optional.of(user));
        when(categoryMapper.toEntity(dto)).thenReturn(category);
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toResponseDTO(category)).thenReturn(response);

        CategoryResponseDTO result = categoryService.save("u1", dto);

        assertSame(user, category.getUser());
        assertSame(response, result);
    }

    @Test
    void deleteById_clearsRelationsThenDeletes() {
        categoryService.deleteById("c1");

        verify(incomeRepository).clearCategoryById("c1");
        verify(expenseRepository).clearCategoryById("c1");
        verify(budgetRepository).clearCategoryById("c1");
        verify(categoryRepository).deleteById("c1");
    }

    @Test
    void findByUserIdAndType_delegatesToRepository() {
        when(categoryRepository.findByUserIdAndType("u1", CategoryType.INCOME))
                .thenReturn(List.of());

        categoryService.findByUserIdAndType("u1", CategoryType.INCOME);

        verify(categoryRepository).findByUserIdAndType("u1", CategoryType.INCOME);
    }
}
