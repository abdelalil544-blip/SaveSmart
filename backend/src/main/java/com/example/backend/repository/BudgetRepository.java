package com.example.backend.repository;

import com.example.backend.Entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, String> {
    List<Budget> findByUserId(String userId);

    Optional<Budget> findByUserIdAndMonthAndYear(String userId, Integer month, Integer year);

    List<Budget> findByUserIdAndCategoryId(String userId, String categoryId);

    @Query("select coalesce(sum(b.budgetAmount), 0) from Budget b " +
            "where b.user.id = :userId and b.month = :month and b.year = :year")
    BigDecimal sumByUserIdAndMonthAndYear(
            @Param("userId") String userId,
            @Param("month") Integer month,
            @Param("year") Integer year
    );

    @Query("select coalesce(sum(b.budgetAmount), 0) from Budget b " +
            "where b.user.id = :userId and b.year = :year")
    BigDecimal sumByUserIdAndYear(
            @Param("userId") String userId,
            @Param("year") Integer year
    );
}
