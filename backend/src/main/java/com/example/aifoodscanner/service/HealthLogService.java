package com.example.aifoodscanner.service;

import com.example.aifoodscanner.entity.HealthLog;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.repository.HealthLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class HealthLogService {

    private final HealthLogRepository healthLogRepository;

    @Transactional
    public HealthLog getOrInitLatestLog(User user) {
        LocalDate today = LocalDate.now();
        Optional<HealthLog> existing = healthLogRepository.findByUserAndLogDate(user, today);
        if (existing.isPresent()) {
            return existing.get();
        }

        // Check if there are any logs. If empty, generate past 30 days history
        List<HealthLog> allLogs = healthLogRepository.findByUserOrderByLogDateDesc(user);
        if (allLogs.isEmpty()) {
            generatePast30DaysHistory(user);
            return healthLogRepository.findByUserAndLogDate(user, today).orElseGet(() -> {
                HealthLog log = HealthLog.builder()
                        .user(user)
                        .weight(68.5)
                        .bmi(21.8)
                        .bodyFatPercent(18.4)
                        .avgCalories(1950.0)
                        .logDate(today)
                        .waterIntakeMl(1800.0)
                        .activeMinutes(30.0)
                        .build();
                return healthLogRepository.save(log);
            });
        }

        // Return latest available log or create today's blank log based on previous values
        HealthLog latest = allLogs.get(0);
        HealthLog todayLog = HealthLog.builder()
                .user(user)
                .weight(latest.getWeight())
                .bmi(latest.getBmi())
                .bodyFatPercent(latest.getBodyFatPercent())
                .avgCalories(latest.getAvgCalories())
                .logDate(today)
                .waterIntakeMl(0.0)
                .activeMinutes(0.0)
                .build();
        return healthLogRepository.save(todayLog);
    }

    @Transactional
    public List<HealthLog> getHealthLogHistory30Days(User user) {
        // Run getOrCreate to make sure data is initialized
        getOrInitLatestLog(user);

        LocalDate startDate = LocalDate.now().minusDays(30);
        return healthLogRepository.findByUserAndLogDateAfterOrderByLogDateAsc(user, startDate);
    }

    @Transactional
    public HealthLog saveTodayLog(User user, Double weight, Double fatPercent, Double waterMl, Double activeMins) {
        LocalDate today = LocalDate.now();
        HealthLog log = healthLogRepository.findByUserAndLogDate(user, today)
                .orElseGet(() -> HealthLog.builder().user(user).logDate(today).build());

        if (weight != null) {
            log.setWeight(weight);
            // BMI = weight / (height^2). Let's assume height 1.77m (height is not set, so BMI = weight / 3.13)
            double height = 1.77;
            log.setBmi(Math.round((weight / (height * height)) * 10.0) / 10.0);
        }
        if (fatPercent != null) {
            log.setBodyFatPercent(fatPercent);
        }
        if (waterMl != null) {
            log.setWaterIntakeMl(waterMl);
        }
        if (activeMins != null) {
            log.setActiveMinutes(activeMins);
        }

        return healthLogRepository.save(log);
    }

    private void generatePast30DaysHistory(User user) {
        LocalDate today = LocalDate.now();
        List<HealthLog> batch = new ArrayList<>();
        Random rand = new Random();

        // 30 days ago to today
        for (int i = 30; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            
            // Weight decreases smoothly from 70.0kg down to 68.5kg
            double baseWeight = 70.0 - ((30.0 - i) / 30.0) * 1.5;
            double weight = Math.round((baseWeight + (rand.nextDouble() * 0.4 - 0.2)) * 10.0) / 10.0;
            
            double bmi = Math.round((weight / (1.77 * 1.77)) * 10.0) / 10.0;
            
            // Fat percentage decreases from 19.5% to 18.4%
            double baseFat = 19.5 - ((30.0 - i) / 30.0) * 1.1;
            double fatPercent = Math.round((baseFat + (rand.nextDouble() * 0.2 - 0.1)) * 10.0) / 10.0;
            
            double calories = 1800 + rand.nextInt(300);
            double water = 1500 + rand.nextInt(1000);
            double active = 20 + rand.nextInt(40);

            HealthLog log = HealthLog.builder()
                    .user(user)
                    .weight(weight)
                    .bmi(bmi)
                    .bodyFatPercent(fatPercent)
                    .avgCalories(calories)
                    .logDate(date)
                    .waterIntakeMl(water)
                    .activeMinutes(active)
                    .build();
            batch.add(log);
        }
        healthLogRepository.saveAll(batch);
    }
}
