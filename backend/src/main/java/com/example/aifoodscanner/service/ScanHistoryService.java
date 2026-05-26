package com.example.aifoodscanner.service;

import com.example.aifoodscanner.dto.DailyAnalytics;
import com.example.aifoodscanner.dto.ScanRequest;
import com.example.aifoodscanner.entity.ScanHistory;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.repository.ScanHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScanHistoryService {

    private final ScanHistoryRepository scanHistoryRepository;

    public ScanHistory saveScan(ScanRequest request, User user) {
        ScanHistory scanHistory = ScanHistory.builder()
                .user(user)
                .foodName(request.getFoodName())
                .calories(request.getCalories())
                .protein(request.getProtein())
                .carbs(request.getCarbs())
                .fat(request.getFat())
                .healthyScore(request.getHealthyScore())
                .rawJsonResult(request.getRawJsonResult())
                .imageUrl(request.getImageUrl())
                .build();
        return scanHistoryRepository.save(scanHistory);
    }

    public List<ScanHistory> getHistory(User user) {
        return scanHistoryRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public DailyAnalytics getDailyAnalytics(User user) {
        LocalDate today = LocalDate.now();
        LocalDateTime sevenDaysAgo = today.minusDays(6).atStartOfDay();

        // Get recent scans for this user in the last 7 days
        List<ScanHistory> recentScans = scanHistoryRepository.findByUserAndCreatedAtAfterOrderByCreatedAtDesc(user, sevenDaysAgo);

        // Calculate today's totals
        double todayCalories = 0;
        double todayProtein = 0;
        double todayCarbs = 0;
        double todayFat = 0;

        LocalDateTime todayStart = today.atStartOfDay();
        for (ScanHistory scan : recentScans) {
            if (!scan.getCreatedAt().isBefore(todayStart)) {
                todayCalories += scan.getCalories();
                todayProtein += scan.getProtein();
                todayCarbs += scan.getCarbs();
                todayFat += scan.getFat();
            }
        }

        // Build weekly history items (from 6 days ago up to today)
        List<DailyAnalytics.DailySummaryItem> weeklyHistory = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(23, 59, 59, 999999999);

            double dayCalories = 0;
            double dayProtein = 0;
            double dayCarbs = 0;
            double dayFat = 0;

            for (ScanHistory scan : recentScans) {
                LocalDateTime cat = scan.getCreatedAt();
                if (!cat.isBefore(startOfDay) && !cat.isAfter(endOfDay)) {
                    dayCalories += scan.getCalories();
                    dayProtein += scan.getProtein();
                    dayCarbs += scan.getCarbs();
                    dayFat += scan.getFat();
                }
            }

            String dayLabel = getVietnameseDayLabel(date);

            weeklyHistory.add(DailyAnalytics.DailySummaryItem.builder()
                    .date(date.toString())
                    .dayOfWeek(dayLabel)
                    .calories(dayCalories)
                    .protein(dayProtein)
                    .carbs(dayCarbs)
                    .fat(dayFat)
                    .build());
        }

        // Default nutrient goals
        return DailyAnalytics.builder()
                .todayCalories(todayCalories)
                .todayProtein(todayProtein)
                .todayCarbs(todayCarbs)
                .todayFat(todayFat)
                .targetCalories(2000.0)
                .targetProtein(75.0)
                .targetCarbs(250.0)
                .targetFat(70.0)
                .weeklyHistory(weeklyHistory)
                .build();
    }

    private String getVietnameseDayLabel(LocalDate date) {
        switch (date.getDayOfWeek()) {
            case MONDAY: return "Thứ 2";
            case TUESDAY: return "Thứ 3";
            case WEDNESDAY: return "Thứ 4";
            case THURSDAY: return "Thứ 5";
            case FRIDAY: return "Thứ 6";
            case SATURDAY: return "Thứ 7";
            case SUNDAY: return "CN";
            default: return "";
        }
    }
}
