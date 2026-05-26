package com.example.aifoodscanner.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meal_plans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(name = "goal_calories")
    private Double goalCalories;

    @Column(name = "goal_protein")
    private Double goalProtein;

    @Column(name = "goal_carbs")
    private Double goalCarbs;

    @Column(name = "goal_fat")
    private Double goalFat;

    @Column(name = "dietary_goal")
    private String dietaryGoal; // e.g., "Tăng cơ", "Keto", "Thuần chay", "Low Carb"

    @Column(name = "plan_date", nullable = false)
    private LocalDate planDate;

    @OneToMany(mappedBy = "mealPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MealPlanItem> items = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
