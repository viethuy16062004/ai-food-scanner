import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./HomePage";
import ScanFoodPage from "./ScanFoodPage";
import HistoryPage from "./HistoryPage";
import ProfilePage from "./ProfilePage";
import AnalysisResultPage from "./AnalysisResultPage";
import MealPlannerPage from "./MealPlannerPage";
import HealthLogPage from "./HealthLogPage";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import { MessageSquare } from "lucide-react";
import AiCoachChat from "../chat/AiCoachChat";

export default function UserApp({ user, onLogout }) {
  const [activeScan, setActiveScan] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
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
          className={`fixed right-8 w-14 h-14 bg-emerald-600 hover:bg-[#047857] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40 focus:outline-none group ${
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
