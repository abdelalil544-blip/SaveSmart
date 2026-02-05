package com.example.backend.dto.income;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MonthlyIncomeResponseDTO {

    private int year;
    private int month;
    private BigDecimal total;
}
