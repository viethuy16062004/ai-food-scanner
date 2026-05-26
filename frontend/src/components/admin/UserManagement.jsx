import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { UserPlus, Camera, Lock, Activity, Filter, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [systemStats, setSystemStats] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    role: "ROLE_USER"
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  const handleToggleStatus = async (userId) => {
    try {
      await api.toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: !u.enabled } : u));
    } catch (err) {
      alert(err.response?.data?.error || "Không thể đổi trạng thái người dùng");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.changeUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.error || "Không thể thay đổi quyền người dùng");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await api.createUser(formData);
      setSuccessMsg("Thêm người dùng mới thành công!");
      setFormData({
        username: "",
        password: "",
        email: "",
        fullName: "",
        role: "ROLE_USER"
      });
      fetchUsers();
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccessMsg("");
      }, 1000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Lỗi khi tạo người dùng");
    }
  };

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
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#065f46] hover:bg-[#064e3b] text-white rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
            >
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
                <th className="px-6 py-4 font-bold">Vai trò</th>
                <th className="px-6 py-4 font-bold">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10"><div className="w-8 h-8 mx-auto border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-500">Không có dữ liệu</td></tr>
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
                    <td className="px-6 py-4 text-gray-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "12/10/2023"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#065f46]" style={{ width: `${Math.min(100, Math.random() * 100)}%` }}></div>
                        </div>
                        <span className="font-semibold text-gray-700">{Math.floor(Math.random() * 200)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="ROLE_USER">Người dùng</option>
                        <option value="ROLE_ADMIN">Quản trị viên</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${u.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        {u.enabled ? 'HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        disabled={u.role === 'ROLE_ADMIN'}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          u.role === 'ROLE_ADMIN'
                            ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                            : u.enabled
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.enabled ? 'Khóa' : 'Mở khóa'}
                      </button>
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-emerald-600" />
              Thêm người dùng mới
            </h3>
            
            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl mb-4">
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div className="bg-emerald-50 text-emerald-700 text-sm font-semibold p-4 rounded-xl mb-4">
                {successMsg}
              </div>
            )}
            
            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tên đăng nhập *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Nhập tên đăng nhập..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mật khẩu *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Nhập mật khẩu..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Họ và Tên</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Nhập họ và tên..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@gmail.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Vai trò *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-emerald-500 font-medium text-gray-700"
                >
                  <option value="ROLE_USER">Người dùng (ROLE_USER)</option>
                  <option value="ROLE_ADMIN">Quản trị viên (ROLE_ADMIN)</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold text-sm text-gray-500 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#065f46] hover:bg-[#064e3b] text-white rounded-xl font-bold text-sm transition-colors"
                >
                  Tạo người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
