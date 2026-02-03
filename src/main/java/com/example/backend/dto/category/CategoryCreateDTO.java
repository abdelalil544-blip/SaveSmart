package com.example.backend.dto.category;

import com.example.backend.Entity.enums.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CategoryCreateDTO {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String name;

    @NotNull(message = "Le type de catégorie est obligatoire")
    private CategoryType type;

    @Size(max = 50)
    private String icon;

    @Size(max = 20)
    private String color;
}
