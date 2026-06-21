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
    private final NotificationService notificationService;

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
        ScanHistory saved = scanHistoryRepository.save(scanHistory);

        try {
            // 1. Send success notification
            String successMsg = String.format("Đã ghi nhận món ăn: %s (+%s kcal) vào lịch sử dinh dưỡng của bạn.", 
                    request.getFoodName(), Math.round(request.getCalories()));
            notificationService.createNotification(user, "Ghi nhận thực phẩm thành công", successMsg, "SUCCESS");

            // 2. Calculate daily calorie total and generate warning if threshold is crossed
            LocalDate today = LocalDate.now();
            LocalDateTime todayStart = today.atStartOfDay();
            List<ScanHistory> todayScans = scanHistoryRepository.findByUserAndCreatedAtAfterOrderByCreatedAtDesc(user, todayStart);
            
            double totalTodayCalories = 0;
            for (ScanHistory scan : todayScans) {
                totalTodayCalories += scan.getCalories() != null ? scan.getCalories() : 0.0;
            }

            double limit = 2000.0; // Daily calorie target
            if (totalTodayCalories > limit) {
                String warningMsg = String.format("Tổng lượng Calo đã nạp hôm nay là %s kcal, vượt quá hạn mức mục tiêu của bạn (%s kcal). Hãy lưu ý điều chỉnh chế độ ăn uống nhé!", 
                        Math.round(totalTodayCalories), Math.round(limit));
                
                // Avoid spamming warning notifications on same day
                boolean hasWarningToday = notificationService.getNotifications(user).stream()
                        .filter(n -> n.getType().equals("WARNING") && n.getCreatedAt().isAfter(todayStart))
                        .anyMatch(n -> n.getTitle().contains("vượt hạn mức") || n.getTitle().contains("Vượt hạn mức"));
                
                if (!hasWarningToday) {
                    notificationService.createNotification(user, "Cảnh báo: Vượt hạn mức Calo", warningMsg, "WARNING");
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to trigger scan notifications: " + e.getMessage());
        }

        return saved;
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
            if (scan.getCreatedAt() != null && !scan.getCreatedAt().isBefore(todayStart)) {
                todayCalories += scan.getCalories() != null ? scan.getCalories() : 0.0;
                todayProtein += scan.getProtein() != null ? scan.getProtein() : 0.0;
                todayCarbs += scan.getCarbs() != null ? scan.getCarbs() : 0.0;
                todayFat += scan.getFat() != null ? scan.getFat() : 0.0;
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
                if (cat != null && !cat.isBefore(startOfDay) && !cat.isAfter(endOfDay)) {
                    dayCalories += scan.getCalories() != null ? scan.getCalories() : 0.0;
                    dayProtein += scan.getProtein() != null ? scan.getProtein() : 0.0;
                    dayCarbs += scan.getCarbs() != null ? scan.getCarbs() : 0.0;
                    dayFat += scan.getFat() != null ? scan.getFat() : 0.0;
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
