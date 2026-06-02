package com.example.aifoodscanner.repository;

import com.example.aifoodscanner.entity.MealPlan;
import com.example.aifoodscanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    Optional<MealPlan> findByUserAndPlanDate(User user, LocalDate planDate);
    Optional<MealPlan> findFirstByUserOrderByPlanDateDesc(User user);
}
