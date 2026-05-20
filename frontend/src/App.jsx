import React, { useState, useEffect } from "react";
import { api } from "./services/api";
import LoginRegister from "./components/auth/LoginRegister";
import CameraScanner from "./components/scanner/CameraScanner";
import Dashboard from "./components/dashboard/Dashboard";
import HistoryList from "./components/history/HistoryList";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import { Activity } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeScan, setActiveScan] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  // Check auth status on mount
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      setIsAuthenticated(true);
      setUser(api.getUser());
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUser(api.getUser());
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUser(null);
    setActiveScan(null);
  };

  // Called when a scan returns successfully from Gateway
  const handleScanSuccess = (analysisResult) => {
    setActiveScan(analysisResult);
    // Increment trigger to signal HistoryList to reload
    setRefreshHistory((prev) => prev + 1);
  };

  // Called when a scan in the list is selected
  const handleSelectHistoryScan = (scanDetails) => {
    setActiveScan(scanDetails);
    
    // Smooth scroll to dashboard if on mobile
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isAuthenticated) {
    return <LoginRegister onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Background radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-emerald-500/5 to-transparent blur-3xl pointer-events-none"></div>

      {/* Header Layout */}
      <Header user={user} onLogout={handleLogout} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Camera Scanner & History (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-8 w-full">
            <div className="glass p-6 rounded-2xl border border-slate-900 shadow-xl flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-lg text-slate-200">Quét Thực Phẩm</h3>
                <p className="text-slate-500 text-xs mt-0.5">Đặt thực phẩm vào khung hình hoặc chụp ảnh nhãn hiệu dinh dưỡng</p>
              </div>
              <CameraScanner onScanSuccess={handleScanSuccess} />
            </div>

            <HistoryList 
              onSelectScan={handleSelectHistoryScan} 
              refreshTrigger={refreshHistory} 
            />
          </div>

          {/* Right Column: Dashboard & Visualization (lg:col-span-7) */}
          <div className="lg:col-span-7 w-full flex flex-col gap-6">
            {activeScan ? (
              <Dashboard 
                scanResult={activeScan} 
                onClearScan={() => setActiveScan(null)} 
              />
            ) : (
              <div className="glass p-12 rounded-2xl border border-slate-900 shadow-xl flex flex-col items-center justify-center text-center text-slate-400 min-h-[480px]">
                <div className="w-20 h-20 bg-slate-900 border border-slate-800 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                  <Activity className="w-10 h-10 text-emerald-500 stroke-[1.5] animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-slate-200 mb-2">Sẵn sàng phân tích</h2>
                <p className="text-sm max-w-xs text-slate-500">
                  Hãy chụp ảnh thực phẩm hoặc tải ảnh từ thư viện để phân tích hàm lượng dinh dưỡng, calo và độ lành mạnh ngay lập tức.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer Layout */}
      <Footer />
    </div>
  );
}
