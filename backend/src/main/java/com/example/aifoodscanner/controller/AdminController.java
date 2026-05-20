package com.example.aifoodscanner.controller;

import com.example.aifoodscanner.entity.Role;
import com.example.aifoodscanner.entity.ScanHistory;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.repository.ScanHistoryRepository;
import com.example.aifoodscanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin
public class AdminController {

    private final UserRepository userRepository;
    private final ScanHistoryRepository scanHistoryRepository;

    /**
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    /**
     * Toggle user enabled/disabled status
     */
    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (user.getRole() == Role.ROLE_ADMIN) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Không thể thay đổi trạng thái tài khoản Admin."));
                    }
                    user.setEnabled(!user.isEnabled());
                    userRepository.save(user);
                    return ResponseEntity.ok(Map.of(
                            "message", user.isEnabled() ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.",
                            "enabled", user.isEnabled()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Change user role
     */
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        if (roleStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thiếu trường role."));
        }

        try {
            Role newRole = Role.valueOf(roleStr);
            return userRepository.findById(id)
                    .map(user -> {
                        user.setRole(newRole);
                        userRepository.save(user);
                        return ResponseEntity.ok(Map.of("message", "Đã cập nhật quyền thành " + newRole.name()));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Role không hợp lệ."));
        }
    }

    /**
     * Get all scan history (all users)
     */
    @GetMapping("/scans")
    public ResponseEntity<List<ScanHistory>> getAllScans() {
        return ResponseEntity.ok(scanHistoryRepository.findAll());
    }

    /**
     * Get overall system stats
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalScans", scanHistoryRepository.count());
        stats.put("totalAdmins", userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_ADMIN).count());
        stats.put("totalActiveUsers", userRepository.findAll().stream()
                .filter(User::isEnabled).count());
        return ResponseEntity.ok(stats);
    }
}
