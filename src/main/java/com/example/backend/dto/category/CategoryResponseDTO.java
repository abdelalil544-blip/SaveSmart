package com.example.backend.dto.category;

import com.example.backend.Entity.enums.CategoryType;
import lombok.Data;

@Data
public class CategoryResponseDTO {

    private String id;
    private String name;
    private CategoryType type;
    private String icon;
    private String color;
}
