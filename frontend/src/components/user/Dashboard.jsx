import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend 
} from "recharts";
import { 
  Heart, AlertTriangle, CheckCircle, Apple, 
  Flame, Dumbbell, FlameKindling, UtensilsCrossed 
} from "lucide-react";

export default function Dashboard({ scanResult, onClearScan }) {
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Fetch daily analytics from Spring Boot
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const data = await api.getDailyAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load daily analytics:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [scanResult]); // Refresh analytics whenever a new scan is completed

  // Colors for nutrition pie chart
  const MACRO_COLORS = {
    carbs: "#38bdf8",    // Sky blue
    protein: "#10b981",  // Emerald green
    fat: "#f43f5e"       // Rose red
  };

  // Convert latest scan result macros to PieChart data
  const getPieData = (result) => {
    if (!result) return [];
    return [
      { name: "Carbs (g)", value: result.carbs || 0, color: MACRO_COLORS.carbs },
      { name: "Protein (g)", value: result.protein || 0, color: MACRO_COLORS.protein },
      { name: "Fat (g)", value: result.fat || 0, color: MACRO_COLORS.fat }
    ].filter(item => item.value > 0);
  };

  // Healthy Score helper class and label
  const getScoreDetails = (score) => {
    if (score < 40) return { color: "from-red-500 to-orange-500", text: "Kém lành mạnh", bg: "bg-red-500/10", border: "border-red-500/20", txt: "text-red-400" };
    if (score < 70) return { color: "from-orange-400 to-yellow-400", text: "Bình thường", bg: "bg-orange-500/10", border: "border-orange-500/20", txt: "text-orange-400" };
    return { color: "from-emerald-400 to-teal-500", text: "Rất lành mạnh", bg: "bg-emerald-500/10", border: "border-emerald-500/20", txt: "text-emerald-400" };
  };

  const pieData = getPieData(scanResult);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* 1. LATEST SCAN RESULT (IF AVAILABLE) */}
      {scanResult && (
        <div className="glass p-6 md:p-8 rounded-2xl shadow-xl flex flex-col gap-6 relative overflow-hidden border border-emerald-500/20">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Apple className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Kết quả quét thực phẩm</span>
                <h2 className="text-2xl font-extrabold text-slate-100 mt-0.5">{scanResult.foodName}</h2>
              </div>
            </div>
            <button 
              onClick={onClearScan}
              className="text-xs font-semibold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 py-2 px-4 rounded-xl transition-all"
            >
              Quét hình mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Col: Summary, Score, PieChart */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Nhận định dinh dưỡng</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{scanResult.summary}</p>
              </div>

              {/* Healthy Score Gauge */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Độ lành mạnh (Healthy Score)</h3>
                  <span className={`text-sm font-bold ${getScoreDetails(scanResult.healthyScore).txt}`}>
                    {scanResult.healthyScore}/100 • {getScoreDetails(scanResult.healthyScore).text}
                  </span>
                </div>
                
                {/* Custom Gradient Slider Bar */}
                <div className="w-full h-4 bg-slate-900 rounded-full relative overflow-hidden border border-slate-800">
                  {/* Background spectrum gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 opacity-30"></div>
                  {/* Highlight track up to score */}
                  <div 
                    className={`h-full bg-gradient-to-r ${getScoreDetails(scanResult.healthyScore).color} rounded-full transition-all duration-1000`}
                    style={{ width: `${scanResult.healthyScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Nutrition macros detail table */}
              <div className="grid grid-cols-4 gap-3 mt-2">
                <div className="glass-card p-3 rounded-xl flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-semibold mb-1">Năng lượng</span>
                  <span className="text-lg font-extrabold text-orange-400">{scanResult.calories}</span>
                  <span className="text-[10px] text-slate-500">kcal</span>
                </div>
                <div className="glass-card p-3 rounded-xl flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-semibold mb-1">Carbs</span>
                  <span className="text-lg font-extrabold text-sky-400">{scanResult.carbs}g</span>
                  <span className="text-[10px] text-sky-500/80">({Math.round((scanResult.carbs * 4 / (scanResult.calories || 1)) * 100)}% kcal)</span>
                </div>
                <div className="glass-card p-3 rounded-xl flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-semibold mb-1">Protein</span>
                  <span className="text-lg font-extrabold text-emerald-400">{scanResult.protein}g</span>
                  <span className="text-[10px] text-emerald-500/80">({Math.round((scanResult.protein * 4 / (scanResult.calories || 1)) * 100)}% kcal)</span>
                </div>
                <div className="glass-card p-3 rounded-xl flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-semibold mb-1">Chất béo</span>
                  <span className="text-lg font-extrabold text-rose-400">{scanResult.fat}g</span>
                  <span className="text-[10px] text-rose-500/80">({Math.round((scanResult.fat * 9 / (scanResult.calories || 1)) * 100)}% kcal)</span>
                </div>
              </div>
            </div>

            {/* Right Col: Pie Chart Visual & Benefits/Warnings */}
            <div className="md:col-span-5 flex flex-col gap-6 justify-center">
              {pieData.length > 0 ? (
                <div className="flex flex-col items-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Tỷ lệ Calo từ Macronutrients</h3>
                  <div className="w-full h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
                          itemStyle={{ color: "#f8fafc" }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
                  Không đủ dữ liệu dinh dưỡng để vẽ biểu đồ
                </div>
              )}
            </div>
          </div>

          {/* Warnings & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-6">
            {/* Warnings/Allergens */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Cảnh báo dinh dưỡng & Dị ứng
              </h4>
              <div className="flex flex-col gap-2">
                {scanResult.warnings && scanResult.warnings.map((w, idx) => (
                  <span key={`w-${idx}`} className="text-sm bg-amber-500/10 border border-amber-500/20 text-amber-400 py-1.5 px-3 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {w}
                  </span>
                ))}
                {scanResult.allergens && scanResult.allergens.map((a, idx) => (
                  <span key={`a-${idx}`} className="text-sm bg-red-500/10 border border-red-500/20 text-red-400 py-1.5 px-3 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Dị ứng: {a}
                  </span>
                ))}
                {(!scanResult.warnings?.length && !scanResult.allergens?.length) && (
                  <span className="text-slate-500 text-xs italic">Không phát hiện cảnh báo nguy hiểm nào.</span>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Lợi ích & Điểm cộng sức khỏe
              </h4>
              <div className="flex flex-col gap-2">
                {scanResult.benefits && scanResult.benefits.map((b, idx) => (
                  <span key={`b-${idx}`} className="text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-1.5 px-3 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {b}
                  </span>
                ))}
                {!scanResult.benefits?.length && (
                  <span className="text-slate-500 text-xs italic">Chưa xác định điểm cộng sức khỏe nào.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TODAY'S DAILY PROGRESS */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Calorie consumption panel */}
          <div className="glass p-6 rounded-2xl flex flex-col gap-4 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Tiêu thụ Calo trong ngày</h3>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-4xl font-extrabold text-slate-100">
                  {Math.round(analytics.todayCalories)}
                </span>
                <span className="text-sm text-slate-500">
                  / {Math.round(analytics.targetCalories)} kcal
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((analytics.todayCalories / analytics.targetCalories) * 100, 100)}%` }}
                ></div>
              </div>
              
              <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                {analytics.todayCalories >= analytics.targetCalories 
                  ? "Bạn đã đạt/vượt mức Calo đề xuất trong ngày!" 
                  : `Bạn còn lại khoảng ${Math.round(analytics.targetCalories - analytics.todayCalories)} kcal để đạt mục tiêu.`}
              </p>
            </div>
          </div>

          {/* Daily macronutrients breakdown */}
          <div className="glass p-6 rounded-2xl md:col-span-2 flex flex-col gap-4 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Hàm lượng dinh dưỡng đã nạp hôm nay</h3>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-2">
              {/* Carbs Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Carbs</span>
                  <span>{Math.round(analytics.todayCarbs)}g / {Math.round(analytics.targetCarbs)}g</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-sky-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((analytics.todayCarbs / analytics.targetCarbs) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500">Tỷ lệ: {Math.round((analytics.todayCarbs / (analytics.targetCarbs || 1)) * 100)}% mục tiêu</span>
              </div>

              {/* Protein Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Protein</span>
                  <span>{Math.round(analytics.todayProtein)}g / {Math.round(analytics.targetProtein)}g</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((analytics.todayProtein / analytics.targetProtein) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500">Tỷ lệ: {Math.round((analytics.todayProtein / (analytics.targetProtein || 1)) * 100)}% mục tiêu</span>
              </div>

              {/* Fat Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span>Chất béo</span>
                  <span>{Math.round(analytics.todayFat)}g / {Math.round(analytics.targetFat)}g</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-rose-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((analytics.todayFat / analytics.targetFat) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500">Tỷ lệ: {Math.round((analytics.todayFat / (analytics.targetFat || 1)) * 100)}% mục tiêu</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. WEEKLY HISTORICAL CHART */}
      {analytics && analytics.weeklyHistory && analytics.weeklyHistory.length > 0 && (
        <div className="glass p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FlameKindling className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Tổng quan dinh dưỡng tuần này</h3>
              <p className="text-slate-500 text-xs mt-0.5">Biểu đồ tổng lượng calo đã nạp qua lịch sử quét</p>
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.weeklyHistory}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis 
                  dataKey="dayOfWeek" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: "bold", fontSize: "12px" }}
                  itemStyle={{ color: "#34d399", fontSize: "13px" }}
                />
                <Bar 
                  dataKey="calories" 
                  name="Năng lượng (kcal)" 
                  fill="url(#colorCal)" 
                  radius={[6, 6, 0, 0]}
                />
                
                {/* SVG Gradients for premium look */}
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
