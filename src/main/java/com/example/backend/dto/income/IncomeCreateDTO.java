package com.example.backend.dto.income;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class IncomeCreateDTO {

    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0", inclusive = false, message = "Le montant doit être positif")
    private BigDecimal amount;

    @NotNull(message = "La date est obligatoire")
    private LocalDate date;

    @Size(max = 255)
    private String description;

    @NotBlank(message = "La catégorie est obligatoire")
    private String categoryId;
}
