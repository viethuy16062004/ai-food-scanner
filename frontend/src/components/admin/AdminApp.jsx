import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import AdminHeader from "../../layouts/AdminHeader";
import Footer from "../../layouts/Footer";
import UserManagement from "./UserManagement";
import AdminDashboard from "./AdminDashboard";
import ScanHistory from "./ScanHistory";
import { LayoutDashboard, Users, History } from "lucide-react";

export default function AdminApp({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { id: "users", label: "Quản lý người dùng", icon: Users },
    { id: "scans", label: "Lịch sử quét", icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "scans" && <ScanHistory />}
      </main>

      <Footer />
    </div>
  );
}
