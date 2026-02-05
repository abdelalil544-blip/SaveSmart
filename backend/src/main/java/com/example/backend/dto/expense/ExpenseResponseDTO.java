package com.example.backend.dto.expense;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseResponseDTO {

    private String id;
    private BigDecimal amount;
    private LocalDate date;
    private String description;
    private String note;
    private String categoryId;
}
