import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { UserPlus, Camera, Lock, Activity, Filter, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [systemStats, setSystemStats] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers();
      setUsers(data || []);
      const statsData = await api.getAdminStats();
      setSystemStats(statsData);
    } catch (err) {
      console.error("Failed to fetch users and stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalUsersCount = systemStats?.totalUsers || users.length;
  const totalScansCount = systemStats?.totalScans || 0;
  const lockedUsersCount = users.filter(u => !u.enabled).length;
  const enabledUsersCount = users.filter(u => u.enabled).length;

  const stats = [
    { label: "Tổng người dùng", value: totalUsersCount.toLocaleString(), icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Thời gian thực" },
    { label: "Tổng lượt quét", value: totalScansCount.toLocaleString(), icon: Camera, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Thời gian thực" },
    { label: "Tài khoản khóa", value: lockedUsersCount.toLocaleString(), icon: Lock, color: "text-gray-500", bg: "bg-gray-100", trend: "Mới cập nhật" },
    { label: "Tài khoản hoạt động", value: enabledUsersCount.toLocaleString(), icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Mới cập nhật" },
  ];

  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase();
    return (u.fullName || "").toLowerCase().includes(query) ||
           (u.username || "").toLowerCase().includes(query) ||
           (u.email || "").toLowerCase().includes(query);
  });

  return (
    <div className="p-8 w-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-bold ${stat.trendColor || 'text-emerald-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-gray-500 text-sm font-semibold mb-1">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-50">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors">
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
            <span className="text-sm text-gray-500">
              Đang hiển thị <span className="font-bold text-gray-700">{filteredUsers.length}</span> người dùng
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên, email..."
                className="w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm text-gray-700 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#065f46] hover:bg-[#064e3b] text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-white border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 font-bold">Họ và Tên</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Ngày tham gia</th>
                <th className="px-6 py-4 font-bold">Lượt quét</th>
                <th className="px-6 py-4 font-bold">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10"><div className="w-8 h-8 mx-auto border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Không có dữ liệu</td></tr>
              ) : (
                filteredUsers.map((u, i) => (
                  <tr key={u.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i % 2 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                        {(u.fullName || u.username || "U").substring(0, 2).toUpperCase()}
                      </div>
                      {u.fullName || u.username}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500">12/10/2023</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#065f46]" style={{ width: `${Math.min(100, Math.random() * 100)}%` }}></div>
                        </div>
                        <span className="font-semibold text-gray-700">{Math.floor(Math.random() * 200)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        {u.enabled ? 'HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Placeholder for actions */}
                      <button className="text-gray-400 hover:text-gray-600">...</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 flex items-center justify-between border-t border-gray-50 bg-white">
          <span className="text-sm text-gray-500">Hiển thị 10 trên mỗi trang</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#065f46] text-white font-bold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-bold text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-bold text-sm">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-bold text-sm">128</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
