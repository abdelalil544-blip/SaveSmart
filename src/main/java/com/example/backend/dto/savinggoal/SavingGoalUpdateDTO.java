package com.example.backend.dto.savinggoal;

import com.example.backend.Entity.enums.GoalStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SavingGoalUpdateDTO {

    @Size(max = 150)
    private String name;

    @DecimalMin(value = "0", inclusive = false, message = "Target amount must be positive")
    private BigDecimal targetAmount;

    @DecimalMin(value = "0", inclusive = true, message = "Current amount must be positive")
    private BigDecimal currentAmount;

    private LocalDate deadline;

    @Size(max = 255)
    private String description;

    private GoalStatus status;
}
