package com.example.backend.dto.user;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UserStatsDTO {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal budgetTotal;
    private long budgetCount;
    private long goalCount;
    private long activeGoals;
    private long completedGoals;
    private long cancelledGoals;
}
