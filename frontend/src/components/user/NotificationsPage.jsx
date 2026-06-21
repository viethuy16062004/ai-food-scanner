import React, { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api";
import {
  Bell, Check, Trash2, AlertTriangle, CheckCircle, Info, RefreshCw
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to fetch notifications page:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationAsRead(id);
      // Update local state directly to be fast
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-emerald-600 shrink-0" />
            Trung tâm thông báo
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý các cập nhật dinh dưỡng, thực đơn AI và cảnh báo sức khỏe của bạn.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotifications}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 transition-all text-slate-600 focus:outline-none"
            title="Làm mới"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 bg-[#047857] hover:bg-[#065f46] text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-sm focus:outline-none"
            >
              <Check className="w-4 h-4" />
              Đọc tất cả
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            filter === "all"
              ? "bg-emerald-50 text-emerald-800"
              : "text-slate-500 hover:text-[#059669] hover:bg-slate-50"
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all relative ${
            filter === "unread"
              ? "bg-emerald-50 text-emerald-800"
              : "text-slate-500 hover:text-[#059669] hover:bg-slate-50"
          }`}
        >
          Chưa đọc ({unreadCount})
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
          )}
        </button>
      </div>

      {/* Main List Area */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Bell className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-bold mb-1">Hộp thư thông báo trống</p>
          <p className="text-slate-400 text-xs font-semibold">
            {filter === "unread" 
              ? "Bạn đã đọc hết tất cả thông báo rồi." 
              : "Hiện tại bạn chưa nhận được thông báo nào từ hệ thống."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredNotifications.map((noti) => (
            <div
              key={noti.id}
              className={`bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-5 flex items-start gap-4 hover:shadow-md hover:border-gray-300 transition-all relative group ${
                !noti.read ? "border-l-4 border-l-emerald-500 bg-emerald-50/10" : ""
              }`}
            >
              {/* Type Icon */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                noti.type === "WARNING" ? "bg-red-50 text-red-500 border-red-100" :
                noti.type === "SUCCESS" ? "bg-emerald-50 text-emerald-500 border-emerald-100" : "bg-blue-50 text-blue-500 border-blue-100"
              }`}>
                {noti.type === "WARNING" ? <AlertTriangle className="w-5 h-5" /> :
                 noti.type === "SUCCESS" ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                  <h3 className={`text-sm sm:text-base text-gray-900 truncate leading-snug ${!noti.read ? "font-extrabold" : "font-bold"}`}>
                    {noti.title}
                  </h3>
                  {!noti.read && (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Mới
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                  {noti.message}
                </p>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-2 block tracking-wider">
                  {new Date(noti.createdAt).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})} - {new Date(noti.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              {/* Actions Button Panel */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                {!noti.read && (
                  <button
                    onClick={() => handleMarkRead(noti.id)}
                    className="p-2 rounded-lg bg-emerald-50 text-[#059669] hover:bg-[#059669] hover:text-white transition-colors focus:outline-none"
                    title="Đánh dấu đã đọc"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(noti.id)}
                  className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors focus:outline-none"
                  title="Xóa thông báo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
