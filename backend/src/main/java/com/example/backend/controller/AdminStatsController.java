package com.example.backend.controller;

import com.example.backend.dto.admin.AdminOverviewStatsDTO;
import com.example.backend.Entity.enums.GoalStatus;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.SavingGoalRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stats")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminStatsController {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final SavingGoalRepository savingGoalRepository;

    public AdminStatsController(
            UserRepository userRepository,
            IncomeRepository incomeRepository,
            ExpenseRepository expenseRepository,
            BudgetRepository budgetRepository,
            SavingGoalRepository savingGoalRepository
    ) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.savingGoalRepository = savingGoalRepository;
    }

    @GetMapping("/overview")
    public ResponseEntity<AdminOverviewStatsDTO> getOverview() {
        AdminOverviewStatsDTO stats = new AdminOverviewStatsDTO();
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActiveTrue();
        stats.setTotalUsers(totalUsers);
        stats.setActiveUsers(activeUsers);
        stats.setInactiveUsers(totalUsers - activeUsers);
        stats.setTotalIncome(incomeRepository.sumAll());
        stats.setTotalExpense(expenseRepository.sumAll());
        stats.setTotalBudgets(budgetRepository.count());
        stats.setTotalBudgetAmount(budgetRepository.sumAll());
        stats.setTotalGoals(savingGoalRepository.count());
        stats.setActiveGoals(savingGoalRepository.countByStatus(GoalStatus.ACTIVE));
        stats.setCompletedGoals(savingGoalRepository.countByStatus(GoalStatus.COMPLETED));
        stats.setCancelledGoals(savingGoalRepository.countByStatus(GoalStatus.CANCELLED));
        return ResponseEntity.ok(stats);
    }
}
