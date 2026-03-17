package com.example.backend.repository;

import com.example.backend.Entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, String> {
    List<Income> findByUserId(String userId);

    List<Income> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);

    List<Income> findByUserIdAndCategoryId(String userId, String categoryId);

    @Query("select coalesce(sum(i.amount), 0) from Income i " +
            "where i.user.id = :userId and i.date between :startDate and :endDate")
    BigDecimal sumByUserIdAndDateBetween(
            @Param("userId") String userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("select coalesce(sum(i.amount), 0) from Income i where i.user.id = :userId")
    BigDecimal sumByUserId(@Param("userId") String userId);

    @Query("select coalesce(sum(i.amount), 0) from Income i")
    BigDecimal sumAll();

    @Modifying
    @Query("update Income i set i.category = null where i.category.id = :categoryId")
    int clearCategoryById(@Param("categoryId") String categoryId);
}
