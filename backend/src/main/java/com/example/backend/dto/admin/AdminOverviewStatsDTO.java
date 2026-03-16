package com.example.backend.dto.admin;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AdminOverviewStatsDTO {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private long totalBudgets;
    private BigDecimal totalBudgetAmount;
    private long totalGoals;
    private long activeGoals;
    private long completedGoals;
    private long cancelledGoals;
}
