package com.example.aifoodscanner.service;

import com.example.aifoodscanner.entity.ShoppingItem;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.repository.ShoppingItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShoppingListService {

    private final ShoppingItemRepository shoppingItemRepository;

    @Transactional
    public List<ShoppingItem> getOrInitShoppingList(User user) {
        List<ShoppingItem> items = shoppingItemRepository.findByUserOrderByCreatedAtAsc(user);
        if (items.isEmpty()) {
            // Populate mockup default items if empty
            List<ShoppingItem> defaultItems = Arrays.asList(
                    ShoppingItem.builder().user(user).itemName("Gà phi lê (500g)").storeCategory("Siêu thị").checked(false).build(),
                    ShoppingItem.builder().user(user).itemName("Cá hồi Nauy (300g)").storeCategory("Chợ hải sản").checked(false).build(),
                    ShoppingItem.builder().user(user).itemName("Sữa chua Hy Lạp (2 hộp)").storeCategory("Cửa hàng tiện lợi").checked(true).build(),
                    ShoppingItem.builder().user(user).itemName("Bơ sáp loại 1 (2 quả)").storeCategory("Quầy trái cây").checked(false).build()
            );
            shoppingItemRepository.saveAll(defaultItems);
            return shoppingItemRepository.findByUserOrderByCreatedAtAsc(user);
        }
        return items;
    }

    @Transactional
    public ShoppingItem toggleItem(Long id) {
        ShoppingItem item = shoppingItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nguyên liệu mua sắm."));
        item.setChecked(!item.getChecked());
        return shoppingItemRepository.save(item);
    }

    @Transactional
    public ShoppingItem addItem(User user, String itemName, String storeCategory) {
        ShoppingItem item = ShoppingItem.builder()
                .user(user)
                .itemName(itemName)
                .storeCategory(storeCategory != null ? storeCategory : "Khác")
                .checked(false)
                .build();
        return shoppingItemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long id) {
        shoppingItemRepository.deleteById(id);
    }
}
