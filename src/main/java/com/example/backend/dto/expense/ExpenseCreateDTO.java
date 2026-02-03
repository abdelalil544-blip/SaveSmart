package com.example.backend.dto.expense;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseCreateDTO {

    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0", inclusive = false, message = "Le montant doit être positif")
    private BigDecimal amount;

    @NotNull(message = "La date est obligatoire")
    private LocalDate date;

    @Size(max = 255)
    private String description;

    @Size(max = 500)
    private String note;

    @NotBlank(message = "La catégorie est obligatoire")
    private String categoryId;
}
