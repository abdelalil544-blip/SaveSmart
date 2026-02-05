package com.example.backend.controller;

import com.example.backend.dto.stats.AnnualStatsResponseDTO;
import com.example.backend.dto.stats.MonthlyStatsResponseDTO;
import com.example.backend.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@PreAuthorize("hasAnyRole('USER','ADMIN')")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyStatsResponseDTO> getMonthly(
            @RequestParam String userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(statsService.getMonthlyStats(userId, year, month));
    }

    @GetMapping("/annual")
    public ResponseEntity<AnnualStatsResponseDTO> getAnnual(
            @RequestParam String userId,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(statsService.getAnnualStats(userId, year));
    }
}
