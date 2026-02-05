package com.example.backend.service;

import com.example.backend.dto.stats.AnnualStatsResponseDTO;
import com.example.backend.dto.stats.MonthlyStatsResponseDTO;

public interface StatsService {

    MonthlyStatsResponseDTO getMonthlyStats(String userId, int year, int month);

    AnnualStatsResponseDTO getAnnualStats(String userId, int year);
}
