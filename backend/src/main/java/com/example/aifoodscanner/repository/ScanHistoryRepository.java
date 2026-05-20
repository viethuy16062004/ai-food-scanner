package com.example.aifoodscanner.repository;

import com.example.aifoodscanner.entity.ScanHistory;
import com.example.aifoodscanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScanHistoryRepository extends JpaRepository<ScanHistory, Long> {
    List<ScanHistory> findByUserOrderByCreatedAtDesc(User user);
    List<ScanHistory> findByUserAndCreatedAtAfterOrderByCreatedAtDesc(User user, LocalDateTime date);
}
