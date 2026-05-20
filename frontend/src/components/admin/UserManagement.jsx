import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Lock, Unlock, Shield, UserCheck, RefreshCw } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    setActionLoading(userId);
    try {
      await api.toggleUserStatus(userId);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    } finally {
      setActionLoading(null);
    }
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
          <h2 className="text-2xl font-extrabold text-slate-100">Quản lý người dùng</h2>
          <p className="text-slate-500 text-sm mt-1">Danh sách tất cả tài khoản trong hệ thống</p>
        </div>
        <button 
          onClick={fetchUsers}
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
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tên đăng nhập</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Họ tên</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vai trò</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trạng thái</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-all">
                <td className="px-6 py-4 text-slate-400 font-mono text-xs">{u.id}</td>
                <td className="px-6 py-4 text-slate-200 font-semibold">{u.username}</td>
                <td className="px-6 py-4 text-slate-300">{u.fullName || "—"}</td>
                <td className="px-6 py-4 text-slate-400">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
                    u.role === "ROLE_ADMIN" 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                      : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  }`}>
                    {u.role === "ROLE_ADMIN" ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                    {u.role === "ROLE_ADMIN" ? "Admin" : "User"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    u.enabled 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {u.enabled ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {u.role !== "ROLE_ADMIN" && (
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      disabled={actionLoading === u.id}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        u.enabled 
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                      } disabled:opacity-50`}
                    >
                      {u.enabled ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {actionLoading === u.id ? "..." : u.enabled ? "Khóa" : "Mở khóa"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
