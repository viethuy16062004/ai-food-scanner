import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import UserManagement from "./UserManagement";
import AdminDashboard from "./AdminDashboard";
import ScanHistory from "./ScanHistory";
import FoodLibrary from "./FoodLibrary";
import SystemSettings from "./SystemSettings";
import {
  LayoutDashboard, Users, BookOpen, BarChart3, Settings, LogOut, Leaf, Search, Bell, UserCircle, ClipboardList, Menu, X
} from "lucide-react";

export default function AdminApp({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/scans")) return "scans";
    if (path.includes("/admin/library")) return "library";
    if (path.includes("/admin/settings")) return "settings";
    return "dashboard";
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: "dashboard", label: "Trang tổng quan", icon: LayoutDashboard, path: "/admin/dashboard" },
    { id: "users", label: "Quản lý người dùng", icon: Users, path: "/admin/users" },
    { id: "scans", label: "Lịch sử quét", icon: ClipboardList, path: "/admin/scans" },
    { id: "library", label: "Thư viện thực phẩm", icon: BookOpen, path: "/admin/library" },
    { id: "settings", label: "Cài đặt hệ thống", icon: Settings, path: "/admin/settings" },
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Trang tổng quan";
      case "users": return "Quản lý người dùng";
      case "scans": return "Lịch sử quét";
      case "library": return "Thư viện thực phẩm";
      case "settings": return "Cài đặt hệ thống";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans w-full min-w-0">
      {/* ========== SIDEBAR OVERLAY FOR MOBILE ========== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========== LEFT SIDEBAR ========== */}
      <aside
        className={`w-64 bg-[#065f46] text-white flex flex-col fixed top-0 left-0 h-screen z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo and close button */}
        <div className="px-6 py-6 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight">AI NutriScan</div>
              <div className="text-[10px] text-emerald-300/80 font-medium">Hệ thống quản trị</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-emerald-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-2 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  isActive
                    ? "bg-white text-[#065f46] font-semibold shadow-sm"
                    : "text-emerald-100 hover:bg-white/10"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div className="px-4 pb-5 mt-auto">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-[#065f46] font-extrabold text-sm shrink-0">
              {(user?.fullName || user?.username || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName || user?.username || "Admin Root"}</p>
              <p className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">SUPER ADMIN</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg hover:bg-white/10 text-emerald-200 hover:text-white transition-colors shrink-0"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center text-gray-800 gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            {activeTab !== "dashboard" && (
              <div className="hidden sm:flex items-center">
                <span className="text-emerald-700 font-semibold mr-2">AI NutriScan</span>
                <span className="text-gray-400 mx-2">/</span>
                <span className="font-bold">{getPageTitle()}</span>
              </div>
            )}
            {activeTab === "dashboard" && (
              <span className="font-bold text-gray-900 block lg:hidden">Trang tổng quan</span>
            )}
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Tìm kiếm hệ thống..." 
                className="bg-gray-100 border-none rounded-full py-2 pl-9 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64"
              />
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 w-full bg-gray-50 overflow-x-hidden flex flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard user={user} />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/scans" element={<ScanHistory />} />
              <Route path="/library" element={<FoodLibrary />} />
              <Route path="/settings" element={<SystemSettings />} />
              <Route path="/analytics" element={<ScanHistory />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </div>
          
          {/* Admin Unified Footer */}
          <footer className="w-full bg-white border-t border-gray-200 mt-auto">
            <div className="px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="font-bold text-emerald-800 text-sm block mb-1">AI NutriScan</span>
                <p className="text-[11px] text-gray-500">© 2024 AI NutriScan. Built for Health.</p>
              </div>
              <div className="flex items-center justify-center gap-4 sm:gap-6 text-[11px] text-gray-500 flex-wrap">
                <a href="#" className="hover:text-gray-700 transition-colors">Chính sách bảo mật</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Điều khoản dịch vụ</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Trung tâm hỗ trợ</a>
                <a href="#" className="hover:text-gray-700 transition-colors">Tài liệu API</a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
