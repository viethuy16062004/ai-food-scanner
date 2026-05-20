import React from "react";
import { LogOut, User, Activity, Sparkles } from "lucide-react";

export default function Header({ user, onLogout, onNavigate, currentPage }) {
  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 text-white shadow-md">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              AI NutriScan
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-2 text-[10px] bg-teal-100 text-teal-700 border border-teal-300 py-0.5 px-1.5 rounded-full font-bold uppercase">
              <Sparkles className="w-2.5 h-2.5" /> Gemini 1.5 Flash
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onNavigate && onNavigate("home")}
            className={`font-medium text-sm ${currentPage === "home" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate && onNavigate("scan")}
            className={`font-medium text-sm ${currentPage === "scan" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            Scan
          </button>
          <button
            onClick={() => onNavigate && onNavigate("history")}
            className={`font-medium text-sm ${currentPage === "history" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            History
          </button>
          <button
            onClick={() => onNavigate && onNavigate("profile")}
            className={`font-medium text-sm ${currentPage === "profile" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            Profile
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Activity className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 py-1.5 px-3 rounded-lg">
            <User className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-gray-700">{user?.fullName || user?.username}</span>
          </div>

          <button
            onClick={onLogout}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-lg border border-transparent hover:border-red-200 transition-all"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
