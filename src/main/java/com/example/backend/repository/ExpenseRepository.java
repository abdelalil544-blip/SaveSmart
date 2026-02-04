package com.example.backend.repository;

import com.example.backend.Entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, String> {
    List<Expense> findByUserId(String userId);

    List<Expense> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    List<Expense> findByUserIdAndCategoryId(String userId, String categoryId);
}
