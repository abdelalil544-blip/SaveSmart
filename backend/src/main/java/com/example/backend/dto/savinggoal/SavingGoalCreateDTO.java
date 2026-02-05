package com.example.backend.dto.savinggoal;

import com.example.backend.Entity.enums.GoalStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SavingGoalCreateDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 150)
    private String name;

    @NotNull(message = "Target amount is required")
    @DecimalMin(value = "0", inclusive = false, message = "Target amount must be positive")
    private BigDecimal targetAmount;

    @DecimalMin(value = "0", inclusive = true, message = "Current amount must be positive")
    private BigDecimal currentAmount;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    @Size(max = 255)
    private String description;

    private GoalStatus status;
}
