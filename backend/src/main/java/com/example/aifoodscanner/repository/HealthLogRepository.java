package com.example.aifoodscanner.repository;

import com.example.aifoodscanner.entity.HealthLog;
import com.example.aifoodscanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthLogRepository extends JpaRepository<HealthLog, Long> {
    Optional<HealthLog> findByUserAndLogDate(User user, LocalDate logDate);
    List<HealthLog> findByUserOrderByLogDateDesc(User user);
    List<HealthLog> findByUserAndLogDateAfterOrderByLogDateAsc(User user, LocalDate date);
}
