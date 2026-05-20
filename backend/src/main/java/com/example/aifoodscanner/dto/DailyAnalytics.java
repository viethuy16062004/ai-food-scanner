package com.example.aifoodscanner.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyAnalytics {
    private Double todayCalories;
    private Double todayProtein;
    private Double todayCarbs;
    private Double todayFat;

    // Default target limits
    private Double targetCalories;
    private Double targetProtein;
    private Double targetCarbs;
    private Double targetFat;

    private List<DailySummaryItem> weeklyHistory;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailySummaryItem {
        private String date; // "yyyy-MM-dd"
        private String dayOfWeek; // e.g. "T2", "T3" (Vietnamese short days)
        private Double calories;
        private Double protein;
        private Double carbs;
        private Double fat;
    }
}
