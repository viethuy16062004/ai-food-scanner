import React, { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api";
import {
  Search, Filter, ChevronDown, Lightbulb, TrendingDown, Flame, X, ArrowUpDown
} from "lucide-react";

// Mini sparkline chart (decorative)
function MiniSparkline({ points = [40, 35, 50, 45, 55, 48, 60, 52, 58, 50, 55, 62] }) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const h = 60, w = 200;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / (max - min)) * h;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#sparkGrad)" />
      <path d={path} fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function HistoryPage() {
  const user = api.getUser();
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [mealFilter, setMealFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [latestLog, setLatestLog] = useState(null);
  const [userHeight, setUserHeight] = useState(() => {
    return localStorage.getItem(`height_${user?.username}`) || "170";
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getScanHistory();
        setHistory(data || []);
        
        const analyticsData = await api.getDailyAnalytics();
        setAnalytics(analyticsData);

        const latest = await api.getLatestHealthLog();
        setLatestLog(latest);

        const savedHeight = localStorage.getItem(`height_${user?.username}`);
        if (savedHeight) {
          setUserHeight(savedHeight);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user?.username]);

  const getMealLabel = (item) => {
    const hour = new Date(item.createdAt).getHours();
    if (hour < 11) return "BỮA SÁNG";
    if (hour < 15) return "BỮA TRƯA";
    return "BỮA TỐI";
  };

  // Return meal category key for filtering
  const getMealCategory = (item) => {
    const hour = new Date(item.createdAt).getHours();
    if (hour < 11) return "morning";
    if (hour < 15) return "lunch";
    return "dinner";
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) return "HÔM NAY";
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) return "HÔM QUA";
      return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    } catch { return ""; }
  };

  const totalWeekCalories = history.reduce((sum, item) => sum + (item.calories || 0), 0);
  const weeklyCaloriePoints = analytics?.weeklyHistory?.map(item => item.calories) || [0, 0, 0, 0, 0, 0, 0];

  // Check if any filter is active
  const hasActiveFilters = searchQuery !== "" || timeFilter !== "all" || mealFilter !== "all" || sortBy !== "newest";

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setTimeFilter("all");
    setMealFilter("all");
    setSortBy("newest");
  };

  // Full filtering + sorting logic
  const filteredHistory = useMemo(() => {
    let result = [...history];

    // 1. Search filter by food name
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(item => item.foodName?.toLowerCase().includes(query));
    }

    // 2. Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (timeFilter === "today") {
        result = result.filter(item => new Date(item.createdAt) >= todayStart);
      } else if (timeFilter === "week") {
        const dayOfWeek = now.getDay(); // 0 = CN
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - mondayOffset);
        result = result.filter(item => new Date(item.createdAt) >= weekStart);
      } else if (timeFilter === "month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        result = result.filter(item => new Date(item.createdAt) >= monthStart);
      }
    }

    // 3. Meal filter
    if (mealFilter !== "all") {
      result = result.filter(item => getMealCategory(item) === mealFilter);
    }

    // 4. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "calories_high":
          return (b.calories || 0) - (a.calories || 0);
        case "calories_low":
          return (a.calories || 0) - (b.calories || 0);
        case "health_high":
          return (b.healthyScore || 0) - (a.healthyScore || 0);
        case "health_low":
          return (a.healthyScore || 0) - (b.healthyScore || 0);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [history, searchQuery, timeFilter, mealFilter, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Lịch sử & Phân tích</h1>
        <p className="text-gray-500 text-sm mt-1">Theo dõi hành trình dinh dưỡng và tiến độ sức khỏe của bạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========== LEFT COLUMN ========== */}
        <div className="lg:col-span-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Tìm kiếm món ăn</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Phở bò, Oishi, Coca..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm text-gray-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Thời gian</label>
                <div className="relative">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-800 appearance-none focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="all">Tất cả thời gian</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Bữa ăn</label>
                <div className="relative">
                  <select
                    value={mealFilter}
                    onChange={(e) => setMealFilter(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-800 appearance-none focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="all">Tất cả bữa</option>
                    <option value="morning">Bữa sáng (trước 11h)</option>
                    <option value="lunch">Bữa trưa (11h-15h)</option>
                    <option value="dinner">Bữa tối (sau 15h)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Sắp xếp</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-800 appearance-none focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="calories_high">Calo cao → thấp</option>
                    <option value="calories_low">Calo thấp → cao</option>
                    <option value="health_high">Điểm sức khỏe cao</option>
                    <option value="health_low">Điểm sức khỏe thấp</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm border border-gray-200"
                >
                  <X className="w-4 h-4" />
                  Xóa lọc
                </button>
              )}
            </div>
          </div>

          {/* Activity List Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-lg">Hoạt động gần đây</h2>
            <span className="text-sm text-gray-500">
              {!loading && (
                hasActiveFilters
                  ? <>{filteredHistory.length} / {history.length} kết quả</>
                  : <>{history.length} bản ghi</>
              )}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              {hasActiveFilters ? (
                <>
                  <p className="text-gray-500 font-semibold mb-2">Không tìm thấy kết quả phù hợp</p>
                  <p className="text-gray-400 text-sm mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-teal-600 font-semibold hover:text-teal-800 underline"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </>
              ) : (
                <p className="text-gray-400">Chưa có lịch sử quét nào.</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredHistory.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Food Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.foodName} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <span className="text-2xl sm:text-3xl">🍽️</span>
                    )}
                  </div>

                  {/* Food Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                        {getMealLabel(item)} • {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{item.foodName}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                      <span className="text-[10px] sm:text-xs bg-teal-100 text-teal-700 font-semibold py-1 px-2 rounded-lg">
                        Protein: {item.protein || 0}g
                      </span>
                      <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 font-semibold py-1 px-2 rounded-lg border border-gray-200">
                        Carbs: {item.carbs || 0}g
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        Béo: {item.fat || 0}g
                      </span>
                    </div>
                  </div>

                  {/* Calories */}
                  <div className="text-right shrink-0">
                    <span className="text-lg sm:text-xl font-extrabold text-teal-700">{Math.round(item.calories || 0)}</span>
                    <span className="text-xs sm:text-sm text-gray-500 ml-1">kcal</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========== RIGHT COLUMN ========== */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Weekly Calories Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 text-base mb-1">Calo tuần này</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold text-teal-700">
                {analytics?.weeklyHistory ? analytics.weeklyHistory.reduce((sum, item) => sum + item.calories, 0).toLocaleString() : totalWeekCalories.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">Tổng kcal</span>
            </div>
            <MiniSparkline points={weeklyCaloriePoints} />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
              {analytics?.weeklyHistory ? (
                analytics.weeklyHistory.map((item, idx) => (
                  <span key={idx}>{item.dayOfWeek}</span>
                ))
              ) : (
                <>
                  <span>CN</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span>
                </>
              )}
            </div>
          </div>

          {/* Body Indices Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-base">Chỉ số cơ thể</h3>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 py-1 px-2.5 rounded-full border border-teal-200">
                Mới nhất
              </span>
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-semibold">Cân nặng</span>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-gray-900">{latestLog?.weight || "—"}</span>
                  <span className="text-xs text-gray-500 ml-0.5">kg</span>
                </div>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-semibold">Chiều cao</span>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-gray-900">{userHeight}</span>
                  <span className="text-xs text-gray-500 ml-0.5">cm</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-semibold">Chỉ số BMI</span>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-teal-700">
                    {latestLog?.bmi || (latestLog?.weight && userHeight ? (latestLog.weight / ((parseFloat(userHeight)/100)**2)).toFixed(1) : "—")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestion Card */}
          <div className="bg-[#065f46] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-emerald-300" />
              <h3 className="font-bold text-lg">Gợi ý từ AI</h3>
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Bạn đang tiêu thụ lượng Protein hơi thấp so với mục tiêu. Hãy bổ sung thêm ức gà hoặc đậu phụ vào bữa tối nay nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
