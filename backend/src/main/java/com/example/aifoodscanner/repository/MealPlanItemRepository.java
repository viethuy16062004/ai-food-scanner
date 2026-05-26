package com.example.aifoodscanner.repository;

import com.example.aifoodscanner.entity.MealPlanItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MealPlanItemRepository extends JpaRepository<MealPlanItem, Long> {
}
