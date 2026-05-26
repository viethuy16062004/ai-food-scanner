import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Search, Filter, ChevronDown, Lightbulb, TrendingDown, Flame
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
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mealFilter, setMealFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getScanHistory();
        setHistory(data || []);
        
        const analyticsData = await api.getDailyAnalytics();
        setAnalytics(analyticsData);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getMealLabel = (item) => {
    const hour = new Date(item.createdAt).getHours();
    if (hour < 11) return "BỮA SÁNG";
    if (hour < 15) return "BỮA TRƯA";
    return "BỮA TỐI";
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) return "HÔM NAY";
      return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    } catch { return ""; }
  };

  const totalWeekCalories = history.reduce((sum, item) => sum + (item.calories || 0), 0);
  const weeklyCaloriePoints = analytics?.weeklyHistory?.map(item => item.calories) || [0, 0, 0, 0, 0, 0, 0];

  const filteredHistory = history.filter((item) => {
    if (searchQuery && !item.foodName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Tìm kiếm món ăn</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Phở bò, Salad..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 text-sm text-gray-800 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Thời gian</label>
                <div className="relative">
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-800 appearance-none focus:outline-none focus:border-teal-500 cursor-pointer">
                    <option>Tất cả thời gian</option>
                    <option>Hôm nay</option>
                    <option>Tuần này</option>
                    <option>Tháng này</option>
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
                    <option value="morning">Bữa sáng</option>
                    <option value="lunch">Bữa trưa</option>
                    <option value="dinner">Bữa tối</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 bg-[#065f46] hover:bg-[#064e3b] text-white font-semibold py-2.5 px-5 rounded-xl transition-colors text-sm">
                <Filter className="w-4 h-4" />
                Lọc
              </button>
            </div>
          </div>

          {/* Activity List */}
          <h2 className="font-bold text-gray-800 text-lg mb-4">Hoạt động gần đây</h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400">Chưa có lịch sử quét nào.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredHistory.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Food Image */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.foodName} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <span className="text-3xl">🍽️</span>
                    )}
                  </div>

                  {/* Food Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                        {getMealLabel(item)} • {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base truncate">{item.foodName}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-teal-100 text-teal-700 font-semibold py-1 px-2.5 rounded-lg">
                        Protein: {item.protein || 0}g
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 font-semibold py-1 px-2.5 rounded-lg border border-gray-200">
                        Carbs: {item.carbs || 0}g
                      </span>
                      <span className="text-xs text-gray-500">
                        Béo: {item.fat || 0}g
                      </span>
                    </div>
                  </div>

                  {/* Calories */}
                  <div className="text-right shrink-0">
                    <span className="text-xl font-extrabold text-teal-700">{Math.round(item.calories || 0)}</span>
                    <span className="text-sm text-gray-500 ml-1">kcal</span>
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

          {/* Weight Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 text-base">Cân nặng</h3>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 py-1 px-2.5 rounded-full border border-teal-200">
                -1.5 kg tuần này
              </span>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <div>
                <span className="text-4xl font-extrabold text-gray-900">68.5</span>
                <span className="text-lg text-gray-500 ml-1">kg</span>
              </div>
              <div className="text-sm text-gray-500">Mục tiêu: <span className="font-semibold">65.0 kg</span></div>
            </div>
            <MiniSparkline />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
              <span>1 THÁNG TRƯỚC</span><span>HIỆN TẠI</span>
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
