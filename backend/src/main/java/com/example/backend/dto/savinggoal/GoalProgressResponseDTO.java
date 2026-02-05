package com.example.backend.dto.savinggoal;

import com.example.backend.Entity.enums.GoalStatus;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GoalProgressResponseDTO {

    private BigDecimal total;
    private BigDecimal percent;
    private BigDecimal remaining;
    private GoalStatus status;
}
