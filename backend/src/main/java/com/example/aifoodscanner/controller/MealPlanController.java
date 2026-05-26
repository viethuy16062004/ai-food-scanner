package com.example.aifoodscanner.controller;

import com.example.aifoodscanner.entity.MealPlan;
import com.example.aifoodscanner.entity.MealPlanItem;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.service.MealPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/meal-plans")
@RequiredArgsConstructor
@CrossOrigin
public class MealPlanController {

    private final MealPlanService mealPlanService;

    @GetMapping("/today")
    public ResponseEntity<?> getTodayPlan(@AuthenticationPrincipal User user) {
        try {
            MealPlan plan = mealPlanService.getOrCreateTodayMealPlan(user);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/diet")
    public ResponseEntity<?> updateDietGoal(@RequestBody Map<String, String> request, @AuthenticationPrincipal User user) {
        try {
            String goal = request.get("dietaryGoal");
            MealPlan plan = mealPlanService.generateNewMealPlan(user, goal);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/items/{itemId}/swap")
    public ResponseEntity<?> swapMealItem(@PathVariable Long itemId) {
        try {
            MealPlanItem item = mealPlanService.swapItem(itemId);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/swap-all")
    public ResponseEntity<?> swapAllMeals(@AuthenticationPrincipal User user) {
        try {
            MealPlan plan = mealPlanService.swapAllMeals(user);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
