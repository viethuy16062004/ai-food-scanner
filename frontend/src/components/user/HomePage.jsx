import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Droplet, ChevronRight, Camera, Activity, Scale, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage({ user, onStartScan, onSelectScan }) {
  const [analytics, setAnalytics] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [latestLog, setLatestLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Water & Metrics Modal states
  const [waterIntake, setWaterIntake] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState("");
  const [inputFat, setInputFat] = useState("");
  const [inputWater, setInputWater] = useState("");
  const [inputActive, setInputActive] = useState("");

  const fetchData = async () => {
    try {
      const data = await api.getDailyAnalytics();
      setAnalytics(data);
      const scans = await api.getRecentScans(4);
      setRecentScans(scans || []);
      
      const log = await api.getLatestHealthLog();
      setLatestLog(log);
      if (log) {
        setWaterIntake(log.waterIntakeMl || 0);
        setInputWeight(log.weight ? log.weight.toString() : "");
        setInputFat(log.bodyFatPercent ? log.bodyFatPercent.toString() : "");
        setInputWater(log.waterIntakeMl ? log.waterIntakeMl.toString() : "");
        setInputActive(log.activeMinutes ? log.activeMinutes.toString() : "");
      }
    } catch (err) {
      console.error("Failed to load home data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddWater = async () => {
    try {
      const nextIntake = waterIntake + 250;
      setWaterIntake(nextIntake);
      const updated = await api.saveTodayHealthLog({
        waterIntakeMl: nextIntake
      });
      setLatestLog(updated);
    } catch (err) {
      console.error("Failed to save water intake:", err);
    }
  };

  const handleOpenModal = () => {
    if (latestLog) {
      setInputWeight(latestLog.weight ? latestLog.weight.toString() : "");
      setInputFat(latestLog.bodyFatPercent ? latestLog.bodyFatPercent.toString() : "");
      setInputWater(latestLog.waterIntakeMl ? latestLog.waterIntakeMl.toString() : "");
      setInputActive(latestLog.activeMinutes ? latestLog.activeMinutes.toString() : "");
    }
    setModalOpen(true);
  };

  const handleSaveMetrics = async (e) => {
    e.preventDefault();
    try {
      const weight = parseFloat(inputWeight) || null;
      const fat = parseFloat(inputFat) || null;
      const water = parseFloat(inputWater) || 0;
      const active = parseFloat(inputActive) || 0;
      
      // Calculate dynamic BMI using height from localStorage
      const savedHeight = parseFloat(localStorage.getItem(`height_${user?.username}`)) || 177;
      const heightM = savedHeight / 100;
      const calculatedBmi = weight ? Math.round((weight / (heightM * heightM)) * 10) / 10 : null;

      const updated = await api.saveTodayHealthLog({
        weight,
        bodyFatPercent: fat,
        waterIntakeMl: water,
        activeMinutes: active,
        bmi: calculatedBmi
      });
      
      setLatestLog(updated);
      setWaterIntake(water);
      setModalOpen(false);
      fetchData(); // Reload all stats and progress
    } catch (err) {
      console.error("Failed to save health metrics:", err);
    }
  };

  const getBmiClass = (bmi) => {
    if (bmi < 18.5) return { label: "Gầy", color: "bg-amber-50 text-amber-700 border-amber-100" };
    if (bmi < 24.9) return { label: "Bình thường", color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
    if (bmi < 29.9) return { label: "Thừa cân", color: "bg-orange-50 text-orange-700 border-orange-100" };
    return { label: "Béo phì", color: "bg-red-50 text-red-700 border-red-100" };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "buổi sáng";
    if (hour < 18) return "buổi chiều";
    return "buổi tối";
  };

  const userName = user?.fullName
    ? user.fullName.split(" ").slice(-1)[0]
    : (user?.username || "Minh");

  // Onboarding / Fallback data mapping to look exactly like mockup if user has no scans
  const displayAnalytics = {
    todayCalories: analytics?.todayCalories || 0,
    targetCalories: analytics?.targetCalories || 2000,
    todayCarbs: analytics?.todayCarbs || 0,
    targetCarbs: analytics?.targetCarbs || 250,
    todayProtein: analytics?.todayProtein || 0,
    targetProtein: analytics?.targetProtein || 75,
    todayFat: analytics?.todayFat || 0,
    targetFat: analytics?.targetFat || 70,
    todayFiber: analytics?.todayFiber || 0,
    targetFiber: 30,
  };

  const combinedScans = recentScans || [];

  const getFoodImage = (scan) => {
    if (scan.imageUrl) return scan.imageUrl;
    const name = (scan.foodName || "").toLowerCase();
    if (name.includes("salad")) return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600";
    if (name.includes("chicken") || name.includes("gà")) return "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600";
    if (name.includes("pizza")) return "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600";
    if (name.includes("smoothie") || name.includes("sinh tố")) return "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=600";
    return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600";
  };

  const getScanTag = (scan) => {
    if (scan.category) return scan.category;
    const score = scan.healthyScore || 80;
    if (score >= 90) return "Lành mạnh";
    if (score >= 80) return "Giàu đạm";
    if (score >= 60) return "Cân bằng";
    return "Cân nhắc";
  };

  const getTagStyle = (tag) => {
    switch (tag) {
      case "Lành mạnh":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Giàu đạm":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "Cân bằng":
        return "bg-[#f4fbf7] text-[#0f766e] border-[#d1fae5]";
      case "Siêu thực phẩm":
        return "bg-teal-50 text-teal-700 border-teal-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-700";
    if (score >= 60) return "text-amber-700";
    return "text-red-700";
  };

  // Circular progress math
  const radius = 64;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const caloriesRatio = displayAnalytics.todayCalories / displayAnalytics.targetCalories;
  const strokeDashoffset = circumference - Math.min(caloriesRatio, 1) * circumference;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#059669] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* GREETING SECTION */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#047857] mb-2 tracking-tight">
            Chào {getGreeting()}, {userName}!
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Hôm nay bạn đang duy trì thói quen rất tốt. Cùng kiểm tra chỉ số nhé.
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

          {/* NĂNG LƯỢNG CARD */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-between min-h-[350px]">
            <h3 className="text-base font-bold text-slate-800">
              Năng lượng
            </h3>

            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  {/* Base Circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#f1f5f9"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#047857"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Center Content */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-[#0f2923] leading-none">
                    {Math.round(displayAnalytics.todayCalories)}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider mt-1.5 uppercase">
                    Kcal đã nạp
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center w-full border-t border-slate-50 pt-4">
              <span className="text-xs font-semibold text-slate-400">
                Mục tiêu: {Math.round(displayAnalytics.targetCalories)} kcal
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {Math.round((displayAnalytics.todayCalories / displayAnalytics.targetCalories) * 100)}%
              </span>
            </div>
          </div>

          {/* DINH DƯỠNG ĐA LƯỢNG CARD */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-between min-h-[350px]">
            <h3 className="text-base font-bold text-slate-800 mb-4">
              Dinh dưỡng đa lượng
            </h3>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {/* Carbs */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">Carbs</span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {Math.round(displayAnalytics.todayCarbs)}g / {Math.round(displayAnalytics.targetCarbs)}g
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((displayAnalytics.todayCarbs / displayAnalytics.targetCarbs) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Protein */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">Protein</span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {Math.round(displayAnalytics.todayProtein)}g / {Math.round(displayAnalytics.targetProtein)}g
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#047857] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((displayAnalytics.todayProtein / displayAnalytics.targetProtein) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Chất béo */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">Chất béo</span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {Math.round(displayAnalytics.todayFat)}g / {Math.round(displayAnalytics.targetFat)}g
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8ba0b5] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((displayAnalytics.todayFat / displayAnalytics.targetFat) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Chất xơ */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">Chất xơ</span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {Math.round(displayAnalytics.todayFiber)}g / {Math.round(displayAnalytics.targetFiber)}g
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#34d399] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((displayAnalytics.todayFiber / displayAnalytics.targetFiber) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* UỐNG NƯỚC CARD */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-between min-h-[350px]">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Uống nước
              </h3>
              <span className="text-xs font-semibold text-slate-400 mt-1 block">Mục tiêu: 2.5L</span>
            </div>

            {/* Water Drops Grid */}
            <div className="flex flex-col items-center justify-center my-auto py-2">
              {/* Row 1: 4 drops */}
              <div className="flex justify-center gap-4 mb-3">
                {[0, 1, 2, 3].map((i) => {
                  const isFilled = waterIntake >= (i + 1) * 500;
                  return (
                    <div
                      key={i}
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${isFilled
                          ? "bg-emerald-50 border-emerald-100"
                          : "bg-slate-50 border-slate-200/80"
                        }`}
                    >
                      <Droplet
                        className={`w-5 h-5 transition-colors duration-300 ${isFilled ? "text-[#059669] fill-[#059669]" : "text-slate-300"
                          }`}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Row 2: 1 drop */}
              <div className="flex justify-center mb-2">
                {[4].map((i) => {
                  const isFilled = waterIntake >= (i + 1) * 500;
                  return (
                    <div
                      key={i}
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${isFilled
                          ? "bg-emerald-50 border-emerald-100"
                          : "bg-slate-50 border-slate-200/80"
                        }`}
                    >
                      <Droplet
                        className={`w-5 h-5 transition-colors duration-300 ${isFilled ? "text-[#059669] fill-[#059669]" : "text-slate-300"
                          }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleAddWater}
              className="w-full bg-[#047857] hover:bg-[#065f46] text-white font-bold py-3.5 px-4 rounded-2xl transition-all hover:shadow-md active:scale-[0.98] text-sm focus:outline-none"
            >
              Thêm 250ml
            </button>
          </div>

        </div>

        {/* QUÉT GẦN ĐÂY SECTION */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Quét gần đây</h2>
            <button
              onClick={() => navigate("/history")}
              className="text-xs text-[#047857] hover:text-[#065f46] font-bold transition-colors flex items-center gap-0.5"
            >
              Xem tất cả
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {combinedScans.length > 0 ? (
              combinedScans.map((scan, idx) => (
                <div
                  key={scan.id || idx}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
                  onClick={() => (onSelectScan ? onSelectScan(scan) : onStartScan())}
                >
                  {/* Food Image */}
                  <div className="relative h-44 bg-slate-50 overflow-hidden rounded-t-3xl">
                    <img
                      src={getFoodImage(scan)}
                      alt={scan.foodName}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    {/* Score Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-slate-100/50 flex items-center gap-1">
                      <span className={`text-xs font-extrabold ${getScoreColor(scan.healthyScore)}`}>
                        {scan.healthyScore}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider">SCORE</span>
                    </div>
                  </div>

                  {/* Food Info */}
                  <div className="p-5">
                    <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">
                      {scan.foodName}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 mb-4">
                      {Math.round(scan.calories)} kcal • {scan.isFiberDisplay ? `${scan.fiber || 8}g Fiber` : `${Math.round(scan.protein)}g Protein`}
                    </p>
                    <div className="flex">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${getTagStyle(getScanTag(scan))}`}>
                        {getScanTag(scan)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center">
                <p className="text-slate-400 font-bold text-sm">Chưa có lịch sử quét thực phẩm.</p>
                <p className="text-slate-400 text-xs mt-1 font-medium">Bấm nút quét bên dưới để bắt đầu bữa ăn lành mạnh!</p>
                <button
                  onClick={() => onStartScan && onStartScan()}
                  className="mt-5 inline-flex items-center gap-2 bg-[#047857] hover:bg-[#065f46] text-white font-extrabold py-3 px-6 rounded-2xl transition-all text-xs focus:outline-none hover:shadow-md active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  Quét thực phẩm ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING CAMERA BUTTON */}
      <button
        onClick={() => onStartScan && onStartScan()}
        className="fixed bottom-8 right-4 sm:right-8 w-14 h-14 bg-[#047857] hover:bg-[#065f46] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40 focus:outline-none"
        title="Quét thực phẩm"
      >
        <Camera className="w-6 h-6 stroke-[1.8]" />
      </button>
    </div>
  );
}
