package com.example.backend.repository;

import com.example.backend.Entity.SavingGoal;
import com.example.backend.Entity.enums.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavingGoalRepository extends JpaRepository<SavingGoal, String> {
    List<SavingGoal> findByUserId(String userId);

    List<SavingGoal> findByUserIdAndStatus(String userId, GoalStatus status);
}
