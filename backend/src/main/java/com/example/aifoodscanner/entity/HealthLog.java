package com.example.aifoodscanner.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    private Double weight;

    private Double bmi;

    @Column(name = "body_fat_percent")
    private Double bodyFatPercent;

    @Column(name = "avg_calories")
    private Double avgCalories;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "water_intake_ml")
    private Double waterIntakeMl;

    @Column(name = "active_minutes")
    private Double activeMinutes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
