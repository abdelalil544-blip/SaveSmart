package com.example.backend.dto.stats;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MonthlyStatsResponseDTO {

    private int year;
    private int month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal net;
    private BigDecimal budgetTotal;
    private BigDecimal budgetRemaining;
}
