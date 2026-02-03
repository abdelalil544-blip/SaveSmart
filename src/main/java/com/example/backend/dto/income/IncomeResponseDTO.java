package com.example.backend.dto.income;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomeResponseDTO {

    private String id;
    private BigDecimal amount;
    private LocalDate date;
    private String description;
    private String categoryId;
}
