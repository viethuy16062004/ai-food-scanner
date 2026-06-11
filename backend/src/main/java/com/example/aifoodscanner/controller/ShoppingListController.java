package com.example.aifoodscanner.controller;

import com.example.aifoodscanner.entity.ShoppingItem;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.service.ShoppingListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shopping-list")
@RequiredArgsConstructor
public class ShoppingListController {

    private final ShoppingListService shoppingListService;

    @GetMapping
    public ResponseEntity<?> getShoppingList(@AuthenticationPrincipal User user) {
        try {
            List<ShoppingItem> list = shoppingListService.getOrInitShoppingList(user);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleItem(@PathVariable Long id) {
        try {
            ShoppingItem item = shoppingListService.toggleItem(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody Map<String, String> request, @AuthenticationPrincipal User user) {
        try {
            String name = request.get("itemName");
            String cat = request.get("storeCategory");
            ShoppingItem item = shoppingListService.addItem(user, name, cat);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            shoppingListService.deleteItem(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa nguyên liệu khỏi danh sách."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
