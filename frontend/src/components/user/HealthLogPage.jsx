import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Lightbulb, Plus, ChevronRight, Activity, Award, CheckCircle, Scale } from "lucide-react";

export default function HealthLogPage({ user }) {
  const [latestLog, setLatestLog] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState("weight"); // "weight" or "calories"
  
  // Metric update modal
  const [modalOpen, setModalOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState("");
  const [inputFat, setInputFat] = useState("");
  const [inputWater, setInputWater] = useState("");
  const [inputActive, setInputActive] = useState("");

  const fetchData = async () => {
    try {
      const latest = await api.getLatestHealthLog();
      setLatestLog(latest);
      const history = await api.getHealthLogHistory();
      setHistoryLogs(history || []);
      const scans = await api.getRecentScans(3);
      setRecentScans(scans || []);
    } catch (err) {
      console.error("Failed to load health metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    if (latestLog) {
      setInputWeight(latestLog.weight || "");
      setInputFat(latestLog.bodyFatPercent || "");
      setInputWater(latestLog.waterIntakeMl || "");
      setInputActive(latestLog.activeMinutes || "");
    }
    setModalOpen(true);
  };

  const handleSaveMetrics = async (e) => {
    e.preventDefault();
    try {
      const data = {
        weight: inputWeight ? parseFloat(inputWeight) : null,
        bodyFatPercent: inputFat ? parseFloat(inputFat) : null,
        waterIntakeMl: inputWater ? parseFloat(inputWater) : null,
        activeMinutes: inputActive ? parseFloat(inputActive) : null
      };
      const updated = await api.saveTodayHealthLog(data);
      setLatestLog(updated);
      
      // Reload history to refresh charts
      const history = await api.getHealthLogHistory();
      setHistoryLogs(history || []);
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save health metrics:", err);
    }
  };

  // Helper mock scans if user has no real scans to keep layout beautiful
  const fallbackRecentScans = [
    {
      id: "fb-1",
      foodName: "Bánh mì quả bơ & Trứng",
      calories: 450,
      protein: 12,
      carbs: 35,
      fat: 18,
      mealType: "BỮA SÁNG • HÔM NAY",
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "fb-2",
      foodName: "Poke Bowl Cá Hồi",
      calories: 620,
      protein: 28,
      carbs: 52,
      fat: 14,
      mealType: "BỮA TRƯA • HÔM QUA",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "fb-3",
      foodName: "Salad Rau Củ Trộn",
      calories: 210,
      protein: 4,
      carbs: 12,
      fat: 8,
      mealType: "BỮA PHỤ • HÔM QUA",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const displayScans = recentScans.length > 0 ? recentScans.map((scan, idx) => ({
    ...scan,
    mealType: idx === 0 ? "HÔM NAY" : "HÔM QUA"
  })) : fallbackRecentScans;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Calculate SVG points for 30-days history graph
  const renderSvgChart = () => {
    if (historyLogs.length < 2) {
      return <div className="h-full flex items-center justify-center text-xs text-slate-400">Không có đủ dữ liệu lịch sử để vẽ biểu đồ.</div>;
    }

    const w = 550;
    const h = 200;
    const padding = 20;

    const values = historyLogs.map(log => chartMetric === "weight" ? log.weight || 0 : log.avgCalories || 0);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    const points = historyLogs.map((log, idx) => {
      const x = padding + (idx / (historyLogs.length - 1)) * (w - 2 * padding);
      const val = chartMetric === "weight" ? log.weight || 0 : log.avgCalories || 0;
      const y = h - padding - ((val - minVal) / valRange) * (h - 2 * padding);
      return { x, y };
    });

    const pathD = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaD = `${pathD} L ${points[points.length - 1].x} ${h - padding} L ${points[0].x} ${h - padding} Z`;

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48 select-none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={w - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={h / 2} x2={w - padding} y2={h / 2} stroke="#f1f5f9" strokeWidth="1" />
        <line x1={padding} y1={h - padding} x2={w - padding} y2={h - padding} stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Area fill */}
        <path d={areaD} fill="url(#chartGrad)" />

        {/* Path line */}
        <path d={pathD} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

        {/* Highlight start and end points */}
        <circle cx={points[0].x} cy={points[0].y} r="4" fill="#ffffff" stroke="#059669" strokeWidth="2.5" />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="#059669" stroke="#ffffff" strokeWidth="2" />
      </svg>
    );
  };

  const currentWeight = latestLog?.weight || 68.5;
  const currentBmi = latestLog?.bmi || 21.8;
  const currentFat = latestLog?.bodyFatPercent || 18.4;
  const currentWater = latestLog?.waterIntakeMl || 1800;
  const currentActive = latestLog?.activeMinutes || 30;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header section with AI recommendation card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Nhật ký Sức khỏe</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-semibold">
            Chào buổi sáng, {user?.fullName || user?.username}! Cùng xem tiến trình của bạn hôm nay.
          </p>
        </div>
        
        {/* Top Right AI Suggestion card */}
        <div className="max-w-md w-full bg-white border border-[#22c55e]/25 rounded-3xl p-5 shadow-sm flex items-start gap-4">
          <div className="bg-[#f0fdf4] p-3 rounded-2xl shrink-0 text-[#15803d]">
            <Lightbulb className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest mb-0.5">Gợi ý từ AI</h4>
            <p className="text-slate-600 text-xs font-semibold leading-relaxed">
              Bạn cần nạp thêm chất xơ từ rau xanh. Hãy thử thêm một phần salad vào bữa trưa nay!
            </p>
          </div>
        </div>
      </div>

      {/* Body Metric cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Weight card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cân nặng</span>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-extrabold text-slate-800">{currentWeight}</span>
            <span className="text-sm text-slate-500 ml-0.5 font-bold">kg</span>
          </div>
          <span className="inline-block mt-3 text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
            -0.5kg tuần này
          </span>
        </div>

        {/* BMI Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Chỉ số BMI</span>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-extrabold text-slate-800">{currentBmi}</span>
          </div>
          <span className="inline-block mt-3 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Bình thường
          </span>
        </div>

        {/* Fat percentage card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tỷ lệ mỡ</span>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-extrabold text-slate-800">{currentFat}</span>
            <span className="text-sm text-slate-500 ml-0.5 font-bold">%</span>
          </div>
          <span className="inline-block mt-3 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
            Cập nhật 2 ngày trước
          </span>
        </div>

        {/* Avg calories card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Calo Trung bình</span>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-extrabold text-[#047857]">1,950</span>
            <span className="text-xs text-slate-500 ml-0.5 font-bold">kcal</span>
          </div>
          <span className="inline-block mt-3 text-[10px] font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
            Duy trì mức ổn định
          </span>
        </div>
      </div>

      {/* 30 Days trend and Personal goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Trend chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-800 text-sm">Tiến trình 30 ngày qua</h3>
            <div className="bg-slate-100 p-0.5 rounded-xl flex gap-1">
              <button
                onClick={() => setChartMetric("weight")}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all ${
                  chartMetric === "weight" ? "bg-white text-[#047857] shadow-xs" : "text-slate-500"
                }`}
              >
                Cân nặng
              </button>
              <button
                onClick={() => setChartMetric("calories")}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all ${
                  chartMetric === "calories" ? "bg-white text-[#047857] shadow-xs" : "text-slate-500"
                }`}
              >
                Calo
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-[200px]">
            {renderSvgChart()}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider px-4 mt-2">
            <span>30 ngày trước</span>
            <span>15 ngày trước</span>
            <span>Hôm nay</span>
          </div>
        </div>

        {/* Goals Progress bar panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-5">Mục tiêu cá nhân</h3>
            
            <div className="flex flex-col gap-5">
              {/* Goal 1: Weight reduction */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Giảm cân (Mục tiêu: 65kg)</span>
                  <span className="text-emerald-700">75%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[75%] rounded-full"></div>
                </div>
              </div>

              {/* Goal 2: Water */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Uống nước (Mục tiêu: 2.5L)</span>
                  <span>{currentWater / 1000} / 2.5L</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((currentWater / 2500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Goal 3: Activity */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Vận động (Mục tiêu: 45p)</span>
                  <span>{currentActive} / 45p</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#22c55e] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((currentActive / 45) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-extrabold py-3 rounded-2xl transition-all shadow-sm mt-6"
          >
            <Plus className="w-3.5 h-3.5" />
            Cập nhật mục tiêu & Chỉ số
          </button>
        </div>
      </div>

      {/* Recent food scan logs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-extrabold text-slate-800 text-sm">Nhật ký dinh dưỡng gần đây</h3>
          <span className="text-xs text-slate-400 font-bold cursor-pointer hover:text-emerald-700 hover:underline flex items-center">
            Xem tất cả
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayScans.map((scan) => (
            <div key={scan.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div className="relative h-44 bg-slate-50 overflow-hidden">
                <img
                  src={scan.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"}
                  alt={scan.foodName}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full text-slate-500 tracking-wider shadow-sm border border-slate-100/50">
                  {scan.mealType || "BỮA ĂN"}
                </span>
                <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  {Math.round(scan.calories || 0)} kcal
                </span>
              </div>
              <div className="p-5">
                <h4 className="font-extrabold text-slate-800 text-sm mb-4 line-clamp-1">{scan.foodName}</h4>
                <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-50 pt-3">
                  <div className="bg-slate-50 rounded-xl p-2">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">PRO</span>
                    <span className="text-xs font-bold text-slate-700 block mt-0.5">{Math.round(scan.protein || 0)}g</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">CARBS</span>
                    <span className="text-xs font-bold text-slate-700 block mt-0.5">{Math.round(scan.carbs || 0)}g</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest block">FATS</span>
                    <span className="text-xs font-bold text-slate-700 block mt-0.5">{Math.round(scan.fat || 0)}g</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Metrics Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-[#047857] text-white p-5">
              <h4 className="font-extrabold text-base">Cập nhật chỉ số hôm nay</h4>
              <p className="text-[10px] text-emerald-100 font-medium">Lưu trữ chỉ số cơ thể để AI Coach phân tích</p>
            </div>
            
            <form onSubmit={handleSaveMetrics} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Cân nặng (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  placeholder="Ví dụ: 68.5"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-300 outline-none text-xs font-semibold px-4 py-3 rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Tỷ lệ mỡ cơ thể (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputFat}
                  onChange={(e) => setInputFat(e.target.value)}
                  placeholder="Ví dụ: 18.4"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-300 outline-none text-xs font-semibold px-4 py-3 rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Nước uống nạp vào (ml)</label>
                <input
                  type="number"
                  step="50"
                  value={inputWater}
                  onChange={(e) => setInputWater(e.target.value)}
                  placeholder="Ví dụ: 2000"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-300 outline-none text-xs font-semibold px-4 py-3 rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Thời gian vận động (phút)</label>
                <input
                  type="number"
                  step="1"
                  value={inputActive}
                  onChange={(e) => setInputActive(e.target.value)}
                  placeholder="Ví dụ: 45"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-300 outline-none text-xs font-semibold px-4 py-3 rounded-2xl"
                />
              </div>

              <div className="flex gap-3 mt-4 border-t border-slate-50 pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-extrabold py-3 rounded-2xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-extrabold py-3 rounded-2xl transition-all shadow-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
