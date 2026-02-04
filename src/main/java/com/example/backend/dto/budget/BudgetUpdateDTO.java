package com.example.backend.dto.budget;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetUpdateDTO {

    @DecimalMin(value = "0", inclusive = false, message = "Amount must be positive")
    private BigDecimal budgetAmount;

    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    private Integer month;

    @Min(value = 2000, message = "Year must be valid")
    @Max(value = 2100, message = "Year must be valid")
    private Integer year;

    private String categoryId;

    private Boolean isGlobal;
}
