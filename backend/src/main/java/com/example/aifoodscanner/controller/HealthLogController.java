package com.example.aifoodscanner.controller;

import com.example.aifoodscanner.entity.HealthLog;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.service.HealthLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health-logs")
@RequiredArgsConstructor
public class HealthLogController {

    private final HealthLogService healthLogService;

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestLog(@AuthenticationPrincipal User user) {
        try {
            HealthLog log = healthLogService.getOrInitLatestLog(user);
            return ResponseEntity.ok(log);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory30Days(@AuthenticationPrincipal User user) {
        try {
            List<HealthLog> logs = healthLogService.getHealthLogHistory30Days(user);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> updateLog(@RequestBody Map<String, Object> request, @AuthenticationPrincipal User user) {
        try {
            Double weight = request.get("weight") != null ? Double.valueOf(request.get("weight").toString()) : null;
            Double fatPercent = request.get("bodyFatPercent") != null ? Double.valueOf(request.get("bodyFatPercent").toString()) : null;
            Double water = request.get("waterIntakeMl") != null ? Double.valueOf(request.get("waterIntakeMl").toString()) : null;
            Double active = request.get("activeMinutes") != null ? Double.valueOf(request.get("activeMinutes").toString()) : null;
            
            HealthLog log = healthLogService.saveTodayLog(user, weight, fatPercent, water, active);
            return ResponseEntity.ok(log);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
