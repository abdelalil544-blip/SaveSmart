package com.example.backend.repository;

import com.example.backend.Entity.SavingGoal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingGoalRepository extends JpaRepository<SavingGoal, String> {
}
