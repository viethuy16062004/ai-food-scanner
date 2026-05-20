import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Calendar, Flame, ChevronRight, RefreshCw, ClipboardList, Activity } from "lucide-react";

export default function HistoryList({ onSelectScan, refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getScanHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch scan history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]); // Refetch history when parent signals a change (e.g. new scan)

  const handleSelect = (item) => {
    try {
      const parsedDetails = JSON.parse(item.rawJsonResult);
      // Ensure we merge and set details properly
      onSelectScan({
        ...parsedDetails,
        id: item.id,
        createdAt: item.createdAt
      });
    } catch (err) {
      // Fallback if parsing fails, reconstruct from database fields
      onSelectScan({
        foodName: item.foodName,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        healthyScore: item.healthyScore,
        summary: "Dữ liệu lưu trữ lịch sử.",
        warnings: [],
        allergens: [],
        benefits: []
      });
    }
  };

  const getScoreBadge = (score) => {
    if (score < 40) return "bg-red-500/10 text-red-400 border border-red-500/20";
    if (score < 70) return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12 text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
        <p className="text-sm">Đang tải lịch sử quét...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto glass p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-slate-200">
          <ClipboardList className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Lịch sử đã quét</h3>
        </div>
        
        <button 
          onClick={fetchHistory}
          disabled={loading}
          className="text-slate-400 hover:text-slate-200 transition-all"
          title="Tải lại lịch sử"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
            <Activity className="w-12 h-12 text-slate-700 mb-2 stroke-[1.5]" />
            <p className="text-sm">Chưa có món ăn nào được quét.</p>
            <p className="text-xs text-slate-600 mt-1">Hãy bắt đầu quét món ăn đầu tiên bằng camera của bạn!</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 cursor-pointer transition-all duration-200"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-bold text-slate-200 text-sm truncate group-hover:text-emerald-400 transition-all">
                  {item.foodName}
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    {formatDate(item.createdAt)}
                  </span>
                  <span className="flex items-center gap-0.5 font-semibold text-orange-400/80">
                    <Flame className="w-3.5 h-3.5 shrink-0" />
                    {Math.round(item.calories)} kcal
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-bold py-1 px-2 rounded-md ${getScoreBadge(item.healthyScore)}`}>
                  {item.healthyScore}đ
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
