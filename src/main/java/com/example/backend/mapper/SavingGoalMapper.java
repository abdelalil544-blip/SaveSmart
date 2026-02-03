package com.example.backend.mapper;

import com.example.backend.Entity.SavingGoal;
import com.example.backend.dto.savinggoal.SavingGoalResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SavingGoalMapper {

    SavingGoalResponseDTO toResponseDTO(SavingGoal entity);
}
