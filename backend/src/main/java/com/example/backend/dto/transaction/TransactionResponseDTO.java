package com.example.backend.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponseDTO {
    private String id;
    private BigDecimal amount;
    private LocalDate date;
    private String description;
    private String categoryId;
    private String categoryName;
    private String categoryColor;
    private String type; // "INCOME" or "EXPENSE"
}
