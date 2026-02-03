package com.example.backend.mapper;

import com.example.backend.Entity.Category;
import com.example.backend.dto.category.CategoryCreateDTO;
import com.example.backend.dto.category.CategoryResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "incomes", ignore = true)
    @Mapping(target = "expenses", ignore = true)
    @Mapping(target = "budgets", ignore = true)
    Category toEntity(CategoryCreateDTO dto);

    CategoryResponseDTO toResponseDTO(Category entity);
}
