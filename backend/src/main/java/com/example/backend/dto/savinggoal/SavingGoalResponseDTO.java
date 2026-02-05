package com.example.backend.dto.savinggoal;

import com.example.backend.Entity.enums.GoalStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SavingGoalResponseDTO {

    private String id;
    private String name;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private LocalDate deadline;
    private String description;
    private GoalStatus status;
}
