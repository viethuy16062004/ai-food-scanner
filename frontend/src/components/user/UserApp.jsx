import React, { useState } from "react";
import HomePage from "./HomePage";
import ScanFoodPage from "./ScanFoodPage";
import HistoryPage from "./HistoryPage";
import ProfilePage from "./ProfilePage";
import CameraScanner from "./CameraScanner";
import Dashboard from "./Dashboard";
import HistoryList from "./HistoryList";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

export default function UserApp({ user, onLogout }) {
  const [currentPage, setCurrentPage] = useState("home");
  const [activeScan, setActiveScan] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleStartScan = () => {
    setActiveScan(null);
    setCurrentPage("scan");
  };

  const handleScanSuccess = (analysisResult) => {
    setActiveScan(analysisResult);
    setRefreshHistory((prev) => prev + 1);
    setCurrentPage("dashboard");
  };

  const handleSelectHistoryScan = (scanDetails) => {
    setActiveScan(scanDetails);
    setCurrentPage("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <Header user={user} onLogout={onLogout} onNavigate={navigate} currentPage={currentPage} />

      <main className="flex-1 w-full relative z-10">
        {currentPage === "home" && <HomePage user={user} onStartScan={handleStartScan} onOpenHistory={(id) => { setCurrentPage("history"); }} />}
        {currentPage === "scan" && <ScanFoodPage onScanSuccess={handleScanSuccess} onBack={() => setCurrentPage("home")} />}
        {currentPage === "history" && <HistoryPage />}
        {currentPage === "profile" && <ProfilePage />}

        {currentPage === "dashboard" && activeScan && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 flex flex-col gap-8 w-full">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
                  <div className="border-b border-gray-200 pb-3">
                    <h3 className="font-extrabold text-lg text-gray-800">Quét Thực Phẩm</h3>
                    <p className="text-gray-600 text-xs mt-0.5">Đặt thực phẩm vào khung hình hoặc chụp ảnh nhãn hiệu dinh dưỡng</p>
                  </div>
                  <CameraScanner onScanSuccess={handleScanSuccess} />
                </div>

                <HistoryList 
                  onSelectScan={handleSelectHistoryScan} 
                  refreshTrigger={refreshHistory} 
                />
              </div>

              <div className="lg:col-span-7 w-full flex flex-col gap-6">
                <Dashboard 
                  scanResult={activeScan} 
                  onClearScan={() => setActiveScan(null)} 
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
