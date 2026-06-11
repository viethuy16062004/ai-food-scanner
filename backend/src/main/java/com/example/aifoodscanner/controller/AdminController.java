package com.example.aifoodscanner.controller;

import com.example.aifoodscanner.entity.Role;
import com.example.aifoodscanner.entity.ScanHistory;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.repository.ScanHistoryRepository;
import com.example.aifoodscanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ScanHistoryRepository scanHistoryRepository;
    private final PasswordEncoder passwordEncoder;

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
     * Create a new user
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String email = body.get("email");
        String fullName = body.get("fullName");
        String roleStr = body.get("role");

        if (username == null || username.trim().isEmpty() ||
            password == null || password.trim().isEmpty() ||
            email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thiếu thông tin bắt buộc (username, password, email)."));
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tên đăng nhập đã tồn tại."));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email đã tồn tại."));
        }

        Role role = Role.ROLE_USER;
        if (roleStr != null && !roleStr.trim().isEmpty()) {
            try {
                role = Role.valueOf(roleStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Role không hợp lệ."));
            }
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .fullName(fullName)
                .role(role)
                .enabled(true)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Thêm người dùng mới thành công!", "username", username));
    }

    /**
     * Get all scan history (all users)
     */
    @GetMapping("/scans")
    public ResponseEntity<List<Map<String, Object>>> getAllScans() {
        List<ScanHistory> histories = scanHistoryRepository.findAll();
        List<Map<String, Object>> response = histories.stream().map(history -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", history.getId());
            map.put("foodName", history.getFoodName());
            map.put("calories", history.getCalories());
            map.put("protein", history.getProtein());
            map.put("carbs", history.getCarbs());
            map.put("fat", history.getFat());
            map.put("healthyScore", history.getHealthyScore());
            map.put("rawJsonResult", history.getRawJsonResult());
            map.put("imageUrl", history.getImageUrl());
            map.put("createdAt", history.getCreatedAt());
            
            Map<String, Object> userMap = new HashMap<>();
            if (history.getUser() != null) {
                userMap.put("id", history.getUser().getId());
                userMap.put("username", history.getUser().getUsername());
                userMap.put("fullName", history.getUser().getFullName());
                userMap.put("email", history.getUser().getEmail());
            } else {
                userMap.put("username", "—");
            }
            map.put("user", userMap);
            
            return map;
        }).toList();
        return ResponseEntity.ok(response);
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
