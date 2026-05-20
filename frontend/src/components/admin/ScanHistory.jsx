import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Calendar, Flame, RefreshCw, ClipboardList, User } from "lucide-react";

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScans = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminScans();
      setScans(data);
    } catch (err) {
      console.error("Failed to fetch scan history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getScoreBadge = (score) => {
    if (score < 40) return "bg-red-500/10 text-red-400 border border-red-500/20";
    if (score < 70) return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100">Lịch sử quét toàn hệ thống</h2>
          <p className="text-slate-500 text-sm mt-1">Tất cả các lượt quét thực phẩm từ mọi người dùng</p>
        </div>
        <button 
          onClick={fetchScans}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-xl transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Tải lại
        </button>
      </div>

      <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Người dùng</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Thực phẩm</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Calo</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Điểm</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {scans.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <ClipboardList className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                  Chưa có lượt quét nào trong hệ thống.
                </td>
              </tr>
            ) : (
              scans.map((scan) => (
                <tr key={scan.id} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-all">
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{scan.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300 text-xs">{scan.user?.username || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-200 font-semibold">{scan.foodName}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-orange-400 font-semibold text-xs">
                      <Flame className="w-3.5 h-3.5" />
                      {Math.round(scan.calories)} kcal
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold py-1 px-2 rounded-md ${getScoreBadge(scan.healthyScore)}`}>
                      {scan.healthyScore}đ
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-slate-500 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(scan.createdAt)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
