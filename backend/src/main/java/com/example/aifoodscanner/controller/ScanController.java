package com.example.aifoodscanner.controller;

import com.example.aifoodscanner.dto.ScanRequest;
import com.example.aifoodscanner.entity.ScanHistory;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.service.ScanHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scans")
@RequiredArgsConstructor
@CrossOrigin
public class ScanController {

    private final ScanHistoryService scanHistoryService;

    @PostMapping
    public ResponseEntity<?> createScan(@RequestBody ScanRequest request, @AuthenticationPrincipal User user) {
        try {
            ScanHistory savedScan = scanHistoryService.saveScan(request, user);
            return ResponseEntity.ok(savedScan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@AuthenticationPrincipal User user) {
        try {
            List<ScanHistory> history = scanHistoryService.getHistory(user);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
