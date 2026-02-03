package com.example.backend.dto.budget;

import java.math.BigDecimal;

public class BudgetResponseDTO {

    private String id;
    private BigDecimal budgetAmount;
    private Integer month;
    private Integer year;
    private Boolean isGlobal;
    private String categoryId; // null si global
}
