package com.example.aifoodscanner.service;

import com.example.aifoodscanner.entity.MealPlan;
import com.example.aifoodscanner.entity.MealPlanItem;
import com.example.aifoodscanner.entity.User;
import com.example.aifoodscanner.entity.HealthLog;
import com.example.aifoodscanner.repository.MealPlanItemRepository;
import com.example.aifoodscanner.repository.MealPlanRepository;
import com.example.aifoodscanner.repository.HealthLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MealPlanService {

    private final MealPlanRepository mealPlanRepository;
    private final MealPlanItemRepository mealPlanItemRepository;
    private final HealthLogRepository healthLogRepository;

    // Helper map of recipes for different diets to mock high-quality AI recommendations
    private static final Map<String, List<Map<String, Object>>> RECIPES = new HashMap<>();

    static {
        // Tăng cơ (Muscle Gain)
        RECIPES.put("Tăng cơ", Arrays.asList(
            createRecipeMap("SÁNG", "Avocado Toast & Trứng Chần", 420.0, 15.0, "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("TRƯA", "Salad Gà Nướng & Quinoa", 580.0, 35.0, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("CHIỀU", "Sữa chua Hy Lạp & Việt Quất", 210.0, 12.0, "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("TỐI", "Cá Hồi Áp Chảo & Măng Tây", 650.0, 40.0, "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=600")
        ));

        // Keto
        RECIPES.put("Keto", Arrays.asList(
            createRecipeMap("SÁNG", "Trứng Cuộn Bột Phô Mai & Bacon", 480.0, 24.0, "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("TRƯA", "Salad Cá Ngừ Mayonnaise Bơ", 590.0, 32.0, "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("CHIỀU", "Quả Hạch Hỗn Hợp Macca & Óc Chó", 240.0, 6.0, "https://images.unsplash.com/photo-1596560548464-f010689b7f43?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("TỐI", "Sườn Heo Nướng Bơ Tỏi", 690.0, 44.0, "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600")
        ));

        // Thuần chay (Vegan)
        RECIPES.put("Thuần chay", Arrays.asList(
            createRecipeMap("SÁNG", "Sinh Tố Xanh Rau Bina & Hạt Chia", 310.0, 8.0, "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("TRƯA", "Đậu Hũ Kho Nấm & Cơm Gạo Lứt", 490.0, 18.0, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("CHIỀU", "Salad Trái Cây Hạnh Nhân", 190.0, 5.0, "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("TỐI", "Cà Ri Rau Củ & Bánh Mì Đen", 520.0, 14.0, "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=600")
        ));

        // Low Carb
        RECIPES.put("Low Carb", Arrays.asList(
            createRecipeMap("SÁNG", "Trứng Chiên Nấm & Măng Tây", 330.0, 18.0, "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("TRƯA", "Bắp Cải Cuộn Thịt Nạc Hấp", 420.0, 28.0, "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("CHIỀU", "Sữa Chua Không Đường Hạt Điều", 180.0, 8.0, "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=600"),
            createRecipeMap("TỐI", "Cá Chẽm Hấp Hành Gừng", 480.0, 36.0, "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=600")
        ));
    }

    private static Map<String, Object> createRecipeMap(String type, String name, Double cals, Double prot, String imgUrl) {
        Map<String, Object> map = new HashMap<>();
        map.put("type", type);
        map.put("name", name);
        map.put("cals", cals);
        map.put("prot", prot);
        map.put("imgUrl", imgUrl);
        return map;
    }

    private static final Map<String, String[]> MEAL_ALTERNATIVES = new HashMap<>();
    static {
        MEAL_ALTERNATIVES.put("SÁNG", new String[]{"Sinh Tố Chuối & Yến Mạch", "Cháo Lòng Đỏ Trứng Gà", "Bánh Mì Đen Kẹp Phô Mai"});
        MEAL_ALTERNATIVES.put("TRƯA", new String[]{"Cơm Gạo Lứt Ức Gà Áp Chảo", "Bò Né Bông Thiên Lý", "Mì Ý Sốt Bò Bằm Ít Béo"});
        MEAL_ALTERNATIVES.put("CHIỀU", new String[]{"Sinh Tố Whey Protein & Dâu Tây", "Hạt Hạnh Nhân Sấy Khô", "Táo Tây & Bơ Đậu Phộng"});
        MEAL_ALTERNATIVES.put("TỐI", new String[]{"Steak Bò Mỹ & Khoai Tây Đút Lò", "Cá Hồi Nướng Giấy Bạc", "Canh Bí Đỏ Nấu Thịt Bằm"});
    }

    @Transactional
    public MealPlan getOrCreateTodayMealPlan(User user) {
        LocalDate today = LocalDate.now();
        Optional<MealPlan> existing = mealPlanRepository.findByUserAndPlanDate(user, today);
        if (existing.isPresent()) {
            return existing.get();
        }
        
        String goal = mealPlanRepository.findFirstByUserOrderByPlanDateDesc(user)
                .map(MealPlan::getDietaryGoal)
                .orElse("Tăng cơ");
                
        return generateNewMealPlan(user, goal);
    }

    @Transactional
    public MealPlan generateNewMealPlan(User user, String goal) {
        LocalDate today = LocalDate.now();
        
        // Remove existing plan for today if any
        mealPlanRepository.findByUserAndPlanDate(user, today).ifPresent(mealPlanRepository::delete);

        // Fetch latest HealthLog data
        List<HealthLog> logs = healthLogRepository.findByUserOrderByLogDateDesc(user);
        HealthLog latestLog = logs.isEmpty() ? null : logs.get(0);

        // Default calculations using weight and calorie expenditure formulas
        double calories = 2000.0;
        double weight = 70.0; // default fallback weight

        if (latestLog != null) {
            if (latestLog.getWeight() != null && latestLog.getWeight() > 0) {
                weight = latestLog.getWeight();
            }
            if (latestLog.getAvgCalories() != null && latestLog.getAvgCalories() > 0) {
                calories = latestLog.getAvgCalories();
            } else {
                // Calculate BMR: Weight (kg) * 22
                double bmr = weight * 22;
                // Calculate TDEE: based on activeMinutes
                double activityFactor = 1.25;
                if (latestLog.getActiveMinutes() != null) {
                    if (latestLog.getActiveMinutes() >= 60) {
                        activityFactor = 1.5;
                    } else if (latestLog.getActiveMinutes() >= 30) {
                        activityFactor = 1.35;
                    }
                }
                calories = bmr * activityFactor;
            }
        } else {
            // Fallback base calories using weight * 22 * 1.3
            calories = weight * 22 * 1.3;
        }

        // Adjust based on the dietaryGoal
        if ("Keto".equalsIgnoreCase(goal)) {
            calories = calories - 300; // deficit for keto
        } else if ("Thuần chay".equalsIgnoreCase(goal)) {
            // maintenance
        } else if ("Low Carb".equalsIgnoreCase(goal)) {
            calories = calories - 200; // mild deficit for fat loss
        } else if ("Tăng cơ".equalsIgnoreCase(goal)) {
            calories = calories + 400; // calorie surplus for muscle gain
        }

        // Round calories to nearest 50
        calories = Math.round(calories / 50.0) * 50.0;
        calories = Math.max(1200.0, Math.min(4000.0, calories));

        // Compute macros based on goal ratios
        double protein = 0.0;
        double carbs = 0.0;
        double fat = 0.0;

        if ("Keto".equalsIgnoreCase(goal)) {
            // Keto: 70% Fat, 25% Protein, 5% Carbs
            protein = (calories * 0.25) / 4.0;
            carbs = (calories * 0.05) / 4.0;
            fat = (calories * 0.70) / 9.0;
        } else if ("Thuần chay".equalsIgnoreCase(goal)) {
            // Vegan: 20% Protein, 60% Carbs, 20% Fat
            protein = (calories * 0.20) / 4.0;
            carbs = (calories * 0.60) / 4.0;
            fat = (calories * 0.20) / 9.0;
        } else if ("Low Carb".equalsIgnoreCase(goal)) {
            // Low Carb: 35% Protein, 20% Carbs, 45% Fat
            protein = (calories * 0.35) / 4.0;
            carbs = (calories * 0.20) / 4.0;
            fat = (calories * 0.45) / 9.0;
        } else {
            // Tăng cơ / Balanced: 30% Protein, 50% Carbs, 20% Fat
            protein = (calories * 0.30) / 4.0;
            carbs = (calories * 0.50) / 4.0;
            fat = (calories * 0.20) / 9.0;
        }

        // Round macros to 1 decimal place
        protein = Math.round(protein * 10.0) / 10.0;
        carbs = Math.round(carbs * 10.0) / 10.0;
        fat = Math.round(fat * 10.0) / 10.0;

        MealPlan plan = MealPlan.builder()
                .user(user)
                .dietaryGoal(goal)
                .goalCalories(calories)
                .goalProtein(protein)
                .goalCarbs(carbs)
                .goalFat(fat)
                .planDate(today)
                .build();

        MealPlan savedPlan = mealPlanRepository.save(plan);
        List<MealPlanItem> items = new ArrayList<>();

        // Retrieve static recipe list and scale it dynamically to fit the custom calorie target
        List<Map<String, Object>> recipes = RECIPES.getOrDefault(goal, RECIPES.get("Tăng cơ"));
        double totalRecipeCalories = recipes.stream().mapToDouble(r -> (Double) r.get("cals")).sum();
        double totalRecipeProtein = recipes.stream().mapToDouble(r -> (Double) r.get("prot")).sum();

        double calorieScale = calories / totalRecipeCalories;
        double proteinScale = protein / totalRecipeProtein;

        for (Map<String, Object> r : recipes) {
            double rawCals = (Double) r.get("cals");
            double rawProt = (Double) r.get("prot");

            MealPlanItem item = MealPlanItem.builder()
                    .mealPlan(savedPlan)
                    .mealType((String) r.get("type"))
                    .foodName((String) r.get("name"))
                    .calories(Math.round(rawCals * calorieScale * 10.0) / 10.0)
                    .protein(Math.round(rawProt * proteinScale * 10.0) / 10.0)
                    .imageUrl((String) r.get("imgUrl"))
                    .build();
            items.add(mealPlanItemRepository.save(item));
        }

        savedPlan.setItems(items);
        return savedPlan;
    }

    @Transactional
    public MealPlanItem swapItem(Long itemId) {
        MealPlanItem item = mealPlanItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy món ăn gợi ý."));
        
        String[] alts = MEAL_ALTERNATIVES.getOrDefault(item.getMealType(), new String[]{"Salad Trứng Luộc"});
        String newName = alts[new Random().nextInt(alts.length)];
        
        item.setFoodName(newName);
        // Slightly random variations to make it dynamic
        item.setCalories(item.getCalories() - 20 + new Random().nextInt(40));
        item.setProtein(item.getProtein() - 3 + new Random().nextInt(6));
        
        return mealPlanItemRepository.save(item);
    }

    @Transactional
    public MealPlan swapAllMeals(User user) {
        MealPlan plan = getOrCreateTodayMealPlan(user);
        for (MealPlanItem item : plan.getItems()) {
            String[] alts = MEAL_ALTERNATIVES.getOrDefault(item.getMealType(), new String[]{"Salad Trứng Luộc"});
            String newName = alts[new Random().nextInt(alts.length)];
            item.setFoodName(newName);
            item.setCalories(item.getCalories() - 30 + new Random().nextInt(60));
            item.setProtein(item.getProtein() - 4 + new Random().nextInt(8));
            mealPlanItemRepository.save(item);
        }
        return plan;
    }
}
