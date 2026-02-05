package com.example.backend.dto.income;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class IncomeCreateDTO {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0", inclusive = false, message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @Size(max = 255)
    private String description;

    @NotBlank(message = "Category is required")
    private String categoryId;
}
