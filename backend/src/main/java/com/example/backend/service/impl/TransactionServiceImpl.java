package com.example.backend.service.impl;

import com.example.backend.Entity.Expense;
import com.example.backend.Entity.Income;
import com.example.backend.dto.transaction.TransactionResponseDTO;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.service.TransactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    public TransactionServiceImpl(IncomeRepository incomeRepository, ExpenseRepository expenseRepository) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
    }

    @Override
    public Page<TransactionResponseDTO> getTransactionsByUser(String userId, LocalDate startDate, LocalDate endDate, String type, Pageable pageable) {
        List<Income> incomes;
        List<Expense> expenses;
        if (startDate != null && endDate != null) {
            incomes = incomeRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
            expenses = expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        } else {
            incomes = incomeRepository.findByUserId(userId);
            expenses = expenseRepository.findByUserId(userId);
        }

        List<TransactionResponseDTO> allTransactions = new ArrayList<>();

        if (type == null || type.equalsIgnoreCase("INCOME") || type.equalsIgnoreCase("ALL")) {
            allTransactions.addAll(incomes.stream()
                .map(i -> TransactionResponseDTO.builder()
                        .id(i.getId())
                        .amount(i.getAmount())
                        .date(i.getDate())
                        .description(i.getDescription())
                        .categoryId(i.getCategory() != null ? i.getCategory().getId() : null)
                        .categoryName(i.getCategory() != null ? i.getCategory().getName() : "Uncategorized")
                        .categoryColor(i.getCategory() != null ? i.getCategory().getColor() : "#1d1c26")
                        .type("INCOME")
                        .build())
                .collect(Collectors.toList()));
        }

        if (type == null || type.equalsIgnoreCase("EXPENSE") || type.equalsIgnoreCase("ALL")) {
            allTransactions.addAll(expenses.stream()
                .map(e -> TransactionResponseDTO.builder()
                        .id(e.getId())
                        .amount(e.getAmount())
                        .date(e.getDate())
                        .description(e.getDescription())
                        .categoryId(e.getCategory() != null ? e.getCategory().getId() : null)
                        .categoryName(e.getCategory() != null ? e.getCategory().getName() : "Uncategorized")
                        .categoryColor(e.getCategory() != null ? e.getCategory().getColor() : "#1d1c26")
                        .type("EXPENSE")
                        .build())
                .collect(Collectors.toList()));
        }

        // Sort by date DESC
        allTransactions.sort(Comparator.comparing(TransactionResponseDTO::getDate).reversed());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allTransactions.size());

        if (start > allTransactions.size()) {
            return new PageImpl<>(new ArrayList<>(), pageable, allTransactions.size());
        }

        return new PageImpl<>(allTransactions.subList(start, end), pageable, allTransactions.size());
    }
}
