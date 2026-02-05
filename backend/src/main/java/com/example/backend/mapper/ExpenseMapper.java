package com.example.backend.mapper;

import com.example.backend.Entity.Expense;
import com.example.backend.dto.expense.ExpenseCreateDTO;
import com.example.backend.dto.expense.ExpenseResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Expense toEntity(ExpenseCreateDTO dto);

    @Mapping(source = "category.id", target = "categoryId")
    ExpenseResponseDTO toResponseDTO(Expense entity);
}
