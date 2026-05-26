import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Bell } from "lucide-react";

export default function Header({ user, onLogout, onNavigate, currentPage }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNav = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(`/${page === "home" ? "home" : page}`);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center">
          <span 
            className="text-xl font-bold text-emerald-800 tracking-tight cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => handleNav("home")}
          >
            Al NutriScan
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <button
            onClick={() => handleNav("home")}
            className={`font-semibold text-sm h-full flex items-center border-b-2 transition-colors duration-200 ${
              currentPage === "home"
                ? "text-[#059669] border-[#059669]"
                : "text-slate-500 hover:text-[#059669] border-transparent"
            }`}
          >
            Trang chủ
          </button>
          <button
            onClick={() => handleNav("scan")}
            className={`font-semibold text-sm h-full flex items-center border-b-2 transition-colors duration-200 ${
              currentPage === "scan"
                ? "text-[#059669] border-[#059669]"
                : "text-slate-500 hover:text-[#059669] border-transparent"
            }`}
          >
            Quét thực phẩm
          </button>
          <button
            onClick={() => handleNav("meal-planner")}
            className={`font-semibold text-sm h-full flex items-center border-b-2 transition-colors duration-200 ${
              currentPage === "meal-planner"
                ? "text-[#059669] border-[#059669]"
                : "text-slate-500 hover:text-[#059669] border-transparent"
            }`}
          >
            Thực đơn AI
          </button>
          <button
            onClick={() => handleNav("health-log")}
            className={`font-semibold text-sm h-full flex items-center border-b-2 transition-colors duration-200 ${
              currentPage === "health-log"
                ? "text-[#059669] border-[#059669]"
                : "text-slate-500 hover:text-[#059669] border-transparent"
            }`}
          >
            Nhật ký sức khỏe
          </button>
          <button
            onClick={() => handleNav("history")}
            className={`font-semibold text-sm h-full flex items-center border-b-2 transition-colors duration-200 ${
              currentPage === "history"
                ? "text-[#059669] border-[#059669]"
                : "text-slate-500 hover:text-[#059669] border-transparent"
            }`}
          >
            Lịch sử
          </button>
        </nav>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="text-slate-500 hover:text-[#059669] p-2 rounded-full hover:bg-slate-50 transition-colors focus:outline-none relative">
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>
          
          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 flex items-center justify-center text-slate-500 hover:text-[#059669] transition-all focus:outline-none"
            >
              <User className="w-5 h-5 stroke-[1.8]" />
            </button>
            
            {dropdownOpen && (
              <>
                {/* Backdrop for click outside */}
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-20">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tài khoản</p>
                    <p className="font-bold text-slate-800 truncate text-sm">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleNav("profile");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#059669] transition-colors flex items-center gap-2 font-semibold"
                  >
                    <User className="w-4 h-4 stroke-[2]" />
                    Hồ sơ cá nhân
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-semibold border-t border-slate-50"
                  >
                    <LogOut className="w-4 h-4 stroke-[2]" />
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
