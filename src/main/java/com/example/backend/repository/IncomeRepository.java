package com.example.backend.repository;

import com.example.backend.Entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income, String> {
}
