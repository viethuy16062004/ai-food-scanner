import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { api } from "../../services/api";
import HomePage from "./HomePage";
import ScanFoodPage from "./ScanFoodPage";
import HistoryPage from "./HistoryPage";
import ProfilePage from "./ProfilePage";
import AnalysisResultPage from "./AnalysisResultPage";
import MealPlannerPage from "./MealPlannerPage";
import HealthLogPage from "./HealthLogPage";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import { MessageSquare, Activity } from "lucide-react";
import AiCoachChat from "../chat/AiCoachChat";

export default function UserApp({ user, onLogout }) {
  const [activeScan, setActiveScan] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  // Onboarding state
  const [needsOnboarding, setNeedsOnboarding] = useState(() => {
    const completed = localStorage.getItem(`onboarding_completed_${user?.username}`);
    return completed !== "true";
  });
  const [inputWeight, setInputWeight] = useState("");
  const [inputHeight, setInputHeight] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [onboardingError, setOnboardingError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Derive currentPage from the URL path for Header highlighting
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.startsWith("/scan")) return "scan";
    if (path.startsWith("/history")) return "history";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/result")) return "result";
    if (path.startsWith("/meal-planner")) return "meal-planner";
    if (path.startsWith("/health-log")) return "health-log";
    return "home";
  };

  const handleNavigate = (page) => {
    navigate(`/${page === "home" ? "home" : page}`);
  };

  const handleStartScan = () => {
    setActiveScan(null);
    navigate("/scan");
  };

  const handleScanSuccess = (analysisResult) => {
    setActiveScan(analysisResult);
    setRefreshHistory((prev) => prev + 1);
    navigate("/result");
  };

  const handleSelectHistoryScan = (scanDetails) => {
    setActiveScan(scanDetails);
    navigate("/result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (needsOnboarding) {
    const handleOnboardingSubmit = async (e) => {
      e.preventDefault();
      if (!inputWeight || !inputHeight) return;
      setOnboardingError("");
      setSubmitting(true);
      try {
        const weight = parseFloat(inputWeight);
        const heightCm = parseFloat(inputHeight);
        
        if (isNaN(weight) || weight < 30 || weight > 300) {
          throw new Error("Cân nặng phải nằm trong khoảng từ 30kg đến 300kg.");
        }
        if (isNaN(heightCm) || heightCm < 100 || heightCm > 250) {
          throw new Error("Chiều cao phải nằm trong khoảng từ 100cm đến 250cm.");
        }

        // Save to local storage
        localStorage.setItem(`height_${user?.username}`, heightCm.toString());
        localStorage.setItem(`weight_${user?.username}`, weight.toString());
        
        // Calculate dynamic BMI
        const heightM = heightCm / 100;
        const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;

        // Save weight and trigger BMI calculation in database health log
        await api.saveTodayHealthLog({
          weight: weight,
          waterIntakeMl: 0.0,
          activeMinutes: 0.0,
          bmi: bmi
        });
        
        localStorage.setItem(`onboarding_completed_${user?.username}`, "true");
        setNeedsOnboarding(false);
      } catch (err) {
        console.error("Failed to save onboarding metrics:", err);
        setOnboardingError(err.message || "Không thể lưu chỉ số sức khỏe. Vui lòng kiểm tra kết nối mạng và thử lại.");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500/10 via-[#f8fafc] to-teal-500/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 text-center relative">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Activity className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">AI NutriScan</h2>
            <p className="text-xs text-emerald-100/90 mt-2 font-medium">Chào mừng {user?.fullName || user?.username}! Hãy thiết lập thông tin sức khỏe ban đầu để bắt đầu.</p>
          </div>

          <form onSubmit={handleOnboardingSubmit} className="p-8 flex flex-col gap-5">
            {onboardingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2">
                <span>⚠️ {onboardingError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Chiều cao của bạn (cm)</label>
              <input
                type="number"
                required
                min="100"
                max="250"
                step="any"
                value={inputHeight}
                onChange={(e) => setInputHeight(e.target.value)}
                placeholder="Ví dụ: 170"
                className="w-full bg-slate-50 border border-slate-200/80 focus:border-emerald-300 outline-none text-sm font-semibold text-slate-800 px-4 py-3.5 rounded-2xl transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Cân nặng của bạn (kg)</label>
              <input
                type="number"
                required
                min="30"
                max="300"
                step="any"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                placeholder="Ví dụ: 65.5"
                className="w-full bg-slate-50 border border-slate-200/80 focus:border-emerald-300 outline-none text-sm font-semibold text-slate-800 px-4 py-3.5 rounded-2xl transition-all"
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3 mt-2">
              <span className="text-emerald-700 font-bold text-sm">💡</span>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                Thông tin này giúp AI Coach tính toán chính xác chỉ số BMI, lượng calo và dinh dưỡng khuyến nghị dành riêng cho thể trạng của bạn.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#047857] hover:bg-[#065f46] disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-700/10 active:scale-[0.98] text-sm focus:outline-none mt-4 flex items-center justify-center gap-2"
            >
              {submitting ? "Đang lưu trữ..." : "Bắt đầu hành trình sức khỏe"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col font-sans">
      <Header user={user} onLogout={onLogout} onNavigate={handleNavigate} currentPage={getCurrentPage()} />

      <main className="flex-1 w-full relative z-10">
        <Routes>
          <Route path="/home" element={<HomePage user={user} onStartScan={handleStartScan} onSelectScan={handleSelectHistoryScan} />} />
          <Route path="/scan" element={<ScanFoodPage onScanSuccess={handleScanSuccess} onBack={() => navigate(-1)} />} />
          <Route path="/meal-planner" element={<MealPlannerPage user={user} onOpenChat={() => setChatOpen(true)} />} />
          <Route path="/health-log" element={<HealthLogPage user={user} />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/result" element={<AnalysisResultPage scanResult={activeScan} onBack={() => navigate(-1)} />} />
          {/* Default redirect to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {/* FLOATING CHAT BUTTON */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className={`fixed right-4 sm:right-8 w-14 h-14 bg-emerald-600 hover:bg-[#047857] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40 focus:outline-none group ${
            getCurrentPage() === "home" ? "bottom-24" : "bottom-8"
          }`}
          title="Trò chuyện với AI Coach"
        >
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
          <MessageSquare className="w-6 h-6 stroke-[1.8]" />
        </button>
      )}

      {/* AI Coach Chat Modal */}
      <AiCoachChat isOpen={chatOpen} onClose={() => setChatOpen(false)} user={user} currentPage={getCurrentPage()} />

      <Footer />
    </div>
  );
}
