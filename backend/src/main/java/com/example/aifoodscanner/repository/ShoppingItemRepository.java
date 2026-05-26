package com.example.aifoodscanner.repository;

import com.example.aifoodscanner.entity.ShoppingItem;
import com.example.aifoodscanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {
    List<ShoppingItem> findByUserOrderByCreatedAtAsc(User user);
}
