import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Sparkles, RefreshCw, CheckSquare, Square, MessageSquare, Plus, Check, Trash2 } from "lucide-react";

export default function MealPlannerPage({ user, onOpenChat }) {
  const [mealPlan, setMealPlan] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newIngredient, setNewIngredient] = useState("");
  const [newCategory, setNewCategory] = useState("Siêu thị");

  const fetchPlanAndList = async () => {
    try {
      const plan = await api.getTodayMealPlan();
      setMealPlan(plan);
      const list = await api.getShoppingList();
      setShoppingList(list);
    } catch (err) {
      console.error("Failed to load planner data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanAndList();
  }, []);

  const handleUpdateDiet = async (diet) => {
    setLoading(true);
    try {
      const updated = await api.updateDietGoal(diet);
      setMealPlan(updated);
      // Refresh shopping list to sync default ingredients
      const list = await api.getShoppingList();
      setShoppingList(list);
    } catch (err) {
      console.error("Failed to update diet goal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapItem = async (itemId) => {
    try {
      const updatedItem = await api.swapMealItem(itemId);
      // Update item in local state
      setMealPlan(prev => {
        const newItems = prev.items.map(item => item.id === itemId ? updatedItem : item);
        return { ...prev, items: newItems };
      });
    } catch (err) {
      console.error("Failed to swap meal item:", err);
    }
  };

  const handleSwapAll = async () => {
    try {
      const updatedPlan = await api.swapAllMeals();
      setMealPlan(updatedPlan);
    } catch (err) {
      console.error("Failed to swap all meals:", err);
    }
  };

  const handleToggleShopping = async (itemId) => {
    try {
      const updatedItem = await api.toggleShoppingItem(itemId);
      setShoppingList(prev => prev.map(item => item.id === itemId ? updatedItem : item));
    } catch (err) {
      console.error("Failed to toggle shopping item:", err);
    }
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    if (!newIngredient.trim()) return;
    try {
      const newItem = await api.addShoppingItem(newIngredient, newCategory);
      setShoppingList(prev => [...prev, newItem]);
      setNewIngredient("");
    } catch (err) {
      console.error("Failed to add ingredient:", err);
    }
  };

  const handleDeleteIngredient = async (id) => {
    try {
      await api.deleteShoppingItem(id);
      setShoppingList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete ingredient:", err);
    }
  };

  const handleSendZalo = () => {
    alert("Đã gửi danh sách mua sắm nguyên liệu qua Zalo của bạn!");
  };

  // Helper date formatted in Vietnamese
  const getFormattedDate = () => {
    const d = new Date();
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    return `${days[d.getDay()]}, ngày ${d.getDate()} tháng ${d.getMonth() + 1}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const dietaryGoal = mealPlan?.dietaryGoal || "Tăng cơ";
  const checkedCount = shoppingList.filter(item => item.checked).length;
  const totalCount = shoppingList.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800">Thực đơn cá nhân hóa</h1>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">
          Dựa trên phân tích AI cho mục tiêu <span className="text-[#047857] font-bold">{dietaryGoal} & Cân bằng vóc dáng</span>
        </p>
      </div>

      {/* Target Macros Grid & Diet selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Calo Target Box */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-600 shadow-sm relative overflow-hidden group">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Mục tiêu Calo</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-extrabold text-[#047857]">{Math.round(mealPlan?.goalCalories || 2250).toLocaleString()}</span>
              <span className="text-xs text-slate-500 font-semibold">kcal/ngày</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600"></div>
          </div>

          {/* Protein Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Protein</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-extrabold text-slate-800">{Math.round(mealPlan?.goalProtein || 160)}g</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-600 h-full w-[75%] rounded-full"></div>
            </div>
          </div>

          {/* Carbs Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Carbs</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-extrabold text-slate-800">{Math.round(mealPlan?.goalCarbs || 220)}g</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-emerald-600 h-full w-[65%] rounded-full"></div>
            </div>
          </div>

          {/* Fat Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Fat</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-extrabold text-slate-800">{Math.round(mealPlan?.goalFat || 65)}g</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-slate-300 h-full w-[45%] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Diet Selector panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#047857]" />
            <h3 className="font-bold text-slate-800 text-sm">Chế độ ăn hiện tại</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Tăng cơ", "Keto", "Thuần chay", "Low Carb"].map((diet) => (
              <button
                key={diet}
                onClick={() => handleUpdateDiet(diet)}
                className={`text-xs font-extrabold px-3 py-1.5 rounded-full border transition-all ${
                  dietaryGoal.toLowerCase() === diet.toLowerCase()
                    ? "bg-[#047857] text-white border-[#047857]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {diet}
              </button>
            ))}
          </div>
          <button
            onClick={() => handleUpdateDiet(dietaryGoal)}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-extrabold py-2.5 rounded-2xl transition-all hover:shadow-sm min-h-[40px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Cập nhật Thực đơn AI
          </button>
        </div>
      </div>

      {/* Suggested Meals section */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Gợi ý từ AI hôm nay</h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{getFormattedDate()}</p>
          </div>
          <button
            onClick={handleSwapAll}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#047857] hover:text-[#065f46] hover:underline bg-emerald-50 px-3 py-2 rounded-2xl transition-colors border border-emerald-100 min-h-[40px] w-full sm:w-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Đổi tất cả
          </button>
        </div>

        {/* Meal cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mealPlan?.items?.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
              <div className="relative h-44 bg-slate-50 overflow-hidden">
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"}
                  alt={item.foodName}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                {/* Meal type badge */}
                <span className="absolute top-3 left-3 bg-[#047857] text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider shadow-sm">
                  {item.mealType}
                </span>
              </div>
              <div className="p-5">
                <h4 className="font-extrabold text-slate-800 text-sm mb-1 line-clamp-1">{item.foodName}</h4>
                <p className="text-xs font-bold text-slate-400 mb-4">
                  {Math.round(item.calories || 0)} kcal • {Math.round(item.protein || 0)}g Protein
                </p>
                <div className="flex border-t border-slate-50 pt-3">
                  <button
                    onClick={() => handleSwapItem(item.id)}
                    className="w-full inline-flex items-center justify-center gap-1 text-[11px] font-extrabold text-emerald-800 hover:text-emerald-950 transition-all hover:bg-slate-50 py-2 rounded-xl border border-slate-100 min-h-[40px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Đổi món
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Layout: Shopping list & Prep Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shopping List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-slate-800 text-base">Danh sách mua sắm</h3>
            <button
              onClick={handleSendZalo}
              className="text-[#047857] hover:text-[#065f46] text-xs font-extrabold hover:underline"
            >
              Gửi qua Zalo
            </button>
          </div>

          {/* Ingredient checkboxes */}
          <div className="flex flex-col gap-3 mb-6">
            {shoppingList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl hover:bg-slate-100/70 transition-colors border border-slate-50/50 cursor-pointer"
                onClick={() => handleToggleShopping(item.id)}
              >
                <div className="flex items-center gap-3">
                  <button className="text-[#047857]">
                    {item.checked ? (
                      <CheckSquare className="w-4 h-4 fill-emerald-100" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <span className={`text-xs font-semibold ${item.checked ? "line-through text-slate-400" : "text-slate-700"}`}>
                    {item.itemName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-100 text-slate-400">
                    {item.storeCategory || "Siêu thị"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteIngredient(item.id);
                    }}
                    className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Ingredient Form */}
          <form onSubmit={handleAddIngredient} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Thêm nguyên liệu mới..."
              className="flex-1 bg-slate-50 border border-slate-100 focus:border-emerald-300 outline-none text-xs font-semibold px-4 py-3 rounded-2xl min-h-[44px]"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 sm:flex-initial bg-slate-50 border border-slate-100 text-xs font-bold px-3 py-3 rounded-2xl outline-none min-h-[44px]"
              >
                <option value="Siêu thị">Siêu thị</option>
                <option value="Chợ hải sản">Chợ hải sản</option>
                <option value="Cửa hàng tiện lợi">Cửa hàng tiện lợi</option>
                <option value="Quầy trái cây">Quầy trái cây</option>
                <option value="Khác">Khác</option>
              </select>
              <button
                type="submit"
                className="bg-[#047857] hover:bg-[#065f46] text-white p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center shrink-0 w-12 h-12 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Column (AI Coach & Progress) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* AI Help Coach Box */}
          <div className="bg-[#f0fdf4] rounded-3xl p-6 border border-emerald-100 relative overflow-hidden">
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Bạn cần giúp đỡ?</h3>
            <p className="text-slate-500 text-xs mt-1 mb-4 leading-relaxed font-semibold">
              Trò chuyện với AI Coach để điều chỉnh thực đơn phù hợp nhất với khẩu vị hôm nay.
            </p>
            <button
              onClick={() => onOpenChat && onOpenChat()}
              className="bg-white border border-emerald-200 hover:border-emerald-300 hover:shadow-sm text-emerald-800 text-xs font-extrabold py-2.5 px-6 rounded-2xl transition-all"
            >
              Bắt đầu Chat
            </button>
            
            {/* Decorative layout pattern in bottom right */}
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 w-16 h-16 bg-[#22c55e]/10 rounded-full flex items-center justify-center text-[#15803d]">
              <MessageSquare className="w-6 h-6 rotate-12 opacity-30" />
            </div>
          </div>

          {/* Preparation Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
            {/* SVG Circular progress */}
            <div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#047857"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-extrabold text-slate-800">{progressPercent}%</span>
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">
                {totalCount > 0 ? `Đã mua ${checkedCount}/${totalCount} nguyên liệu` : "Chưa có nguyên liệu cần mua"}
              </h4>
              <p className="text-[11px] text-slate-400 font-bold mt-1">
                {progressPercent === 100 ? "Tất cả đã sẵn sàng!" : "Thực đơn cho ngày mai đang được chuẩn bị!"}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
