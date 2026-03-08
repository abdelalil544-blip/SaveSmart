package com.example.backend.service;

import com.example.backend.dto.transaction.TransactionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    Page<TransactionResponseDTO> getTransactionsByUser(String userId, Pageable pageable);
}
