import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Users, ScanLine, ShieldCheck, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const cards = [
    { label: "Tổng người dùng", value: stats?.totalUsers || 0, icon: Users, color: "text-sky-400", bg: "bg-sky-500/10" },
    { label: "Tổng lượt quét", value: stats?.totalScans || 0, icon: ScanLine, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Quản trị viên", value: stats?.totalAdmins || 0, icon: ShieldCheck, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Người dùng hoạt động", value: stats?.totalActiveUsers || 0, icon: Activity, color: "text-violet-400", bg: "bg-violet-500/10" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-100">Bảng điều khiển</h2>
        <p className="text-slate-500 text-sm mt-1">Tổng quan hệ thống AI NutriScan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <span className="text-3xl font-extrabold text-slate-100">{card.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
