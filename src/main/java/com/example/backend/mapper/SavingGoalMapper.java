package com.example.backend.mapper;

import com.example.backend.Entity.SavingGoal;
import com.example.backend.dto.savinggoal.SavingGoalCreateDTO;
import com.example.backend.dto.savinggoal.SavingGoalResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SavingGoalMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    SavingGoal toEntity(SavingGoalCreateDTO dto);

    SavingGoalResponseDTO toResponseDTO(SavingGoal entity);
}
