package com.example.backend.service;

import com.example.backend.Entity.enums.GoalStatus;
import com.example.backend.dto.savinggoal.GoalProgressResponseDTO;
import com.example.backend.dto.savinggoal.SavingGoalCreateDTO;
import com.example.backend.dto.savinggoal.SavingGoalResponseDTO;
import com.example.backend.dto.savinggoal.SavingGoalUpdateDTO;

import java.util.List;
import java.util.Optional;

public interface SavingGoalService {
    SavingGoalResponseDTO save(String userId, SavingGoalCreateDTO dto);

    SavingGoalResponseDTO update(String id, SavingGoalUpdateDTO dto);

    Optional<SavingGoalResponseDTO> findById(String id);

    List<SavingGoalResponseDTO> findAll();

    void deleteById(String id);

    List<SavingGoalResponseDTO> findByUserId(String userId);

    List<SavingGoalResponseDTO> findByUserIdAndStatus(String userId, GoalStatus status);

    GoalProgressResponseDTO getGoalProgress(String id);
}
