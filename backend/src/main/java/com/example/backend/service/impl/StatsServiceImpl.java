package com.example.backend.service.impl;

import com.example.backend.dto.stats.AnnualStatsResponseDTO;
import com.example.backend.dto.stats.MonthlyStatsResponseDTO;
import com.example.backend.exception.BadRequestException;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.service.StatsService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class StatsServiceImpl implements StatsService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    public StatsServiceImpl(
            IncomeRepository incomeRepository,
            ExpenseRepository expenseRepository,
            BudgetRepository budgetRepository
    ) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public MonthlyStatsResponseDTO getMonthlyStats(String userId, int year, int month) {
        if (month < 1 || month > 12) {
            throw new BadRequestException("Month must be between 1 and 12");
        }
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        BigDecimal totalIncome = incomeRepository.sumByUserIdAndDateBetween(userId, start, end);
        BigDecimal totalExpense = expenseRepository.sumByUserIdAndDateBetween(userId, start, end);
        BigDecimal budgetTotal = budgetRepository.sumByUserIdAndMonthAndYear(userId, month, year);

        MonthlyStatsResponseDTO response = new MonthlyStatsResponseDTO();
        response.setYear(year);
        response.setMonth(month);
        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setNet(totalIncome.subtract(totalExpense));
        response.setBudgetTotal(budgetTotal);
        response.setBudgetRemaining(budgetTotal.subtract(totalExpense));
        return response;
    }

    @Override
    public AnnualStatsResponseDTO getAnnualStats(String userId, int year) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);

        BigDecimal totalIncome = incomeRepository.sumByUserIdAndDateBetween(userId, start, end);
        BigDecimal totalExpense = expenseRepository.sumByUserIdAndDateBetween(userId, start, end);
        BigDecimal budgetTotal = budgetRepository.sumByUserIdAndYear(userId, year);

        AnnualStatsResponseDTO response = new AnnualStatsResponseDTO();
        response.setYear(year);
        response.setTotalIncome(totalIncome);
        response.setTotalExpense(totalExpense);
        response.setNet(totalIncome.subtract(totalExpense));
        response.setBudgetTotal(budgetTotal);
        response.setBudgetRemaining(budgetTotal.subtract(totalExpense));
        return response;
    }
}
