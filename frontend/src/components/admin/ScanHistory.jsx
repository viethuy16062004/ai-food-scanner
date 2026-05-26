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
    <div className="p-8 w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Lịch sử quét toàn hệ thống</h2>
          <p className="text-gray-500 text-sm mt-1">Tất cả các lượt quét thực phẩm từ mọi người dùng</p>
        </div>
        <button 
          onClick={fetchScans}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all shadow-sm font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          Tải lại
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Thực phẩm</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Calo</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Điểm</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {scans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <ClipboardList className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    Chưa có lượt quét nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                scans.map((scan) => (
                  <tr key={scan.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">#{scan.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span className="text-gray-700 font-medium">{scan.user?.username || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{scan.foodName}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-orange-600 font-semibold text-xs">
                        <Flame className="w-3.5 h-3.5" />
                        {Math.round(scan.calories)} kcal
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold ${
                        scan.healthyScore >= 70
                          ? "bg-emerald-50 text-emerald-700"
                          : scan.healthyScore >= 40
                          ? "bg-orange-50 text-orange-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {scan.healthyScore} điểm
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
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
    </div>
  );
}
