import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Bell, Menu, X, Check, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { api } from "../services/api";

export default function Header({ user, onLogout, onNavigate, currentPage }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleNav = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(`/${page === "home" ? "home" : page}`);
    }
  };

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const list = await api.getNotifications();
      setNotifications(list);
      
      const countData = await api.getUnreadNotificationsCount();
      setUnreadCount(countData.count || 0);
    } catch (err) {
      console.error("Failed to load notifications in header:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LOGO & MOBILE TOGGLE */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span 
            className="text-xl font-bold text-emerald-800 tracking-tight cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={() => {
              handleNav("home");
              setMobileMenuOpen(false);
            }}
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
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="text-slate-500 hover:text-[#059669] p-2 rounded-full hover:bg-slate-50 transition-colors focus:outline-none relative"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl py-3 z-20 flex flex-col max-h-[480px]">
                  {/* Dropdown Header */}
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">Thông báo</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#059669] hover:underline font-semibold flex items-center gap-1 focus:outline-none"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Đọc tất cả
                      </button>
                    )}
                  </div>

                  {/* Dropdown Body */}
                  <div className="flex-1 overflow-y-auto max-h-[320px] py-1 divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-slate-400 text-xs font-semibold">
                        Không có thông báo nào
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((noti) => (
                        <div 
                          key={noti.id} 
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 relative ${!noti.read ? "bg-emerald-50/20" : ""}`}
                          onClick={() => {
                            if (!noti.read) handleMarkRead(noti.id);
                            setNotificationsOpen(false);
                            handleNav("notifications");
                          }}
                        >
                          {/* Left Icon depending on type */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            noti.type === "WARNING" ? "bg-red-50 text-red-500" :
                            noti.type === "SUCCESS" ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                          }`}>
                            {noti.type === "WARNING" ? <AlertTriangle className="w-4 h-4" /> :
                             noti.type === "SUCCESS" ? <CheckCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                          </div>

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs text-slate-800 leading-snug ${!noti.read ? "font-bold" : "font-medium"}`}>
                              {noti.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                              {noti.message}
                            </p>
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-1 block">
                              {new Date(noti.createdAt).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})} - {new Date(noti.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>

                          {/* Read indicator */}
                          {!noti.read && (
                            <span className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="px-4 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        handleNav("notifications");
                      }}
                      className="w-full text-center text-xs font-bold text-slate-600 hover:text-[#059669] hover:bg-slate-50 py-2.5 rounded-xl transition-all"
                    >
                      Xem tất cả thông báo
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          
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
                      setMobileMenuOpen(false);
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
                      setMobileMenuOpen(false);
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

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-2 shadow-inner">
          <button
            onClick={() => {
              handleNav("home");
              setMobileMenuOpen(false);
            }}
            className={`font-semibold text-sm py-2.5 text-left border-b border-slate-50 hover:text-[#059669] ${
              currentPage === "home" ? "text-[#059669]" : "text-slate-500"
            }`}
          >
            Trang chủ
          </button>
          <button
            onClick={() => {
              handleNav("scan");
              setMobileMenuOpen(false);
            }}
            className={`font-semibold text-sm py-2.5 text-left border-b border-slate-50 hover:text-[#059669] ${
              currentPage === "scan" ? "text-[#059669]" : "text-slate-500"
            }`}
          >
            Quét thực phẩm
          </button>
          <button
            onClick={() => {
              handleNav("meal-planner");
              setMobileMenuOpen(false);
            }}
            className={`font-semibold text-sm py-2.5 text-left border-b border-slate-50 hover:text-[#059669] ${
              currentPage === "meal-planner" ? "text-[#059669]" : "text-slate-500"
            }`}
          >
            Thực đơn AI
          </button>
          <button
            onClick={() => {
              handleNav("health-log");
              setMobileMenuOpen(false);
            }}
            className={`font-semibold text-sm py-2.5 text-left border-b border-slate-50 hover:text-[#059669] ${
              currentPage === "health-log" ? "text-[#059669]" : "text-slate-500"
            }`}
          >
            Nhật ký sức khỏe
          </button>
          <button
            onClick={() => {
              handleNav("history");
              setMobileMenuOpen(false);
            }}
            className={`font-semibold text-sm py-2.5 text-left hover:text-[#059669] ${
              currentPage === "history" ? "text-[#059669]" : "text-slate-500"
            }`}
          >
            Lịch sử
          </button>
        </div>
      )}
    </header>
  );
}
