import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./HomePage";
import ScanFoodPage from "./ScanFoodPage";
import HistoryPage from "./HistoryPage";
import ProfilePage from "./ProfilePage";
import AnalysisResultPage from "./AnalysisResultPage";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

export default function UserApp({ user, onLogout }) {
  const [activeScan, setActiveScan] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Derive currentPage from the URL path for Header highlighting
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.startsWith("/scan")) return "scan";
    if (path.startsWith("/history")) return "history";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/result")) return "result";
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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <Header user={user} onLogout={onLogout} onNavigate={handleNavigate} currentPage={getCurrentPage()} />

      <main className="flex-1 w-full relative z-10">
        <Routes>
          <Route path="/home" element={<HomePage user={user} onStartScan={handleStartScan} onOpenHistory={() => navigate("/history")} />} />
          <Route path="/scan" element={<ScanFoodPage onScanSuccess={handleScanSuccess} onBack={() => navigate(-1)} />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/result" element={<AnalysisResultPage scanResult={activeScan} onBack={() => navigate(-1)} />} />
          {/* Default redirect to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
