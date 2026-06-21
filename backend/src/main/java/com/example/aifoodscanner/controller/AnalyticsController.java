package com.example.aifoodscanner.controller;

import com.example.aifoodscanner.dto.DailyAnalytics;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.service.ScanHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final ScanHistoryService scanHistoryService;

    @GetMapping("/daily")
    public ResponseEntity<?> getDailyAnalytics(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not authenticated or session expired"));
        }
        try {
            DailyAnalytics analytics = scanHistoryService.getDailyAnalytics(user);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
