package com.example.backend.mapper;

import com.example.backend.Entity.Income;
import com.example.backend.dto.income.IncomeCreateDTO;
import com.example.backend.dto.income.IncomeResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IncomeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Income toEntity(IncomeCreateDTO dto);

    @Mapping(source = "category.id", target = "categoryId")
    IncomeResponseDTO toResponseDTO(Income entity);
}
