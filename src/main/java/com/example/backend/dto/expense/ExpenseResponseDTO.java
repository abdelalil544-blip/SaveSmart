package com.example.backend.dto.expense;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseResponseDTO {

    private String id;
    private BigDecimal amount;
    private LocalDate date;
    private String description;
    private String note;
    private String categoryId;
}
