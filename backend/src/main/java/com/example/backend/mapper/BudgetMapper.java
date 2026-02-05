package com.example.backend.mapper;

import com.example.backend.Entity.Budget;
import com.example.backend.dto.budget.BudgetCreateDTO;
import com.example.backend.dto.budget.BudgetResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BudgetMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Budget toEntity(BudgetCreateDTO dto);

    @Mapping(target = "categoryId", expression = "java(entity.getCategory() != null ? entity.getCategory().getId() : null)")
    BudgetResponseDTO toResponseDTO(Budget entity);
}
