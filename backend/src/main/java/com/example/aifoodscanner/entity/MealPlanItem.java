package com.example.aifoodscanner.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "meal_plan_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "mealPlan")
public class MealPlanItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_plan_id", nullable = false)
    @JsonIgnore
    private MealPlan mealPlan;

    @Column(name = "meal_type")
    private String mealType; // "SÁNG", "TRƯA", "CHIỀU", "TỐI"

    @Column(name = "food_name")
    private String foodName;

    private Double calories;

    private Double protein;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;
}
