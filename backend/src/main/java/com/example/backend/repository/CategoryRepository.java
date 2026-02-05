package com.example.backend.repository;

import com.example.backend.Entity.Category;
import com.example.backend.Entity.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, String> {
    List<Category> findByUserId(String userId);

    List<Category> findByUserIdAndType(String userId, CategoryType type);
}
