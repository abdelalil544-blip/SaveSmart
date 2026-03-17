package com.example.backend.service;

import com.example.backend.dto.transaction.TransactionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface TransactionService {
    Page<TransactionResponseDTO> getTransactionsByUser(String userId, LocalDate startDate, LocalDate endDate, Pageable pageable);
}
