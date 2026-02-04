package com.example.backend.dto.category;

import com.example.backend.Entity.enums.CategoryType;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryUpdateDTO {

    @Size(max = 100)
    private String name;

    private CategoryType type;

    @Size(max = 50)
    private String icon;

    @Size(max = 20)
    private String color;
}
