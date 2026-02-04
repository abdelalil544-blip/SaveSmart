package com.example.backend.repository;

import com.example.backend.Entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, String> {
    List<Budget> findByUserId(String userId);

    Optional<Budget> findByUserIdAndMonthAndYear(String userId, Integer month, Integer year);

    List<Budget> findByUserIdAndCategoryId(String userId, String categoryId);
}
