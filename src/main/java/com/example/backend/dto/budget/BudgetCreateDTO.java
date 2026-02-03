package com.example.backend.dto.budget;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetCreateDTO {

    @NotNull(message = "Le montant du budget est obligatoire")
    @DecimalMin(value = "0", inclusive = false, message = "Le montant doit être positif")
    private BigDecimal budgetAmount;

    @NotNull(message = "Le mois est obligatoire")
    @Min(value = 1, message = "Le mois doit être entre 1 et 12")
    @Max(value = 12, message = "Le mois doit être entre 1 et 12")
    private Integer month;

    @NotNull(message = "L'année est obligatoire")
    @Min(value = 2000, message = "L'année doit être valide")
    @Max(value = 2100, message = "L'année doit être valide")
    private Integer year;

    private String categoryId; // null = budget global

    private Boolean isGlobal = false;
}
