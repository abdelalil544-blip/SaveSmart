package com.example.backend.dto.income;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomeUpdateDTO {

    @DecimalMin(value = "0", inclusive = false, message = "Amount must be positive")
    private BigDecimal amount;

    private LocalDate date;

    @Size(max = 255)
    private String description;

    private String categoryId;
}
