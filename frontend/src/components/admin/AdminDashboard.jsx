import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  ScanLine, Brain, Users, Clock, TrendingUp,
  ArrowRight, FileText, BarChart3, Database, Shield, Lock,
  Heart, Zap, Sparkles, ChevronRight
} from "lucide-react";

// Mini bar chart component (decorative)
function MiniBarChart() {
  const bars = [35, 55, 42, 68, 50, 75, 60];
  return (
    <div className="flex items-end gap-1.5 h-28">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md bg-gradient-to-t from-[#065f46] to-[#059669] opacity-70 transition-all hover:opacity-100"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export default function AdminDashboard({ user }) {
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

  const totalScans = stats?.totalScans || 0;
  const totalUsers = stats?.totalUsers || 0;
  const totalActiveUsers = stats?.totalActiveUsers || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== HERO SECTION ========== */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Version badge */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Phiên bản 4.0 Stable
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
            Hệ thống Quản trị
            <br />
            <span className="bg-gradient-to-r from-[#065f46] to-[#059669] bg-clip-text text-transparent">
              Dinh dưỡng AI Toàn diện
            </span>
          </h1>

          <p className="text-gray-500 text-sm md:text-base max-w-2xl mt-4 leading-relaxed">
            Kiểm soát toàn bộ dữ liệu, tinh chỉnh mô hình học máy và tối ưu hoá trải nghiệm người dùng 
            với các công cụ phân tích thời gian thực mạnh mẽ nhất.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-8">
            <button className="flex items-center gap-2 bg-[#065f46] hover:bg-[#064e3b] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
              <Zap className="w-4 h-4" />
              Bắt đầu quản lý ngay
            </button>
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-300 hover:border-gray-400 shadow-sm transition-all text-sm">
              <FileText className="w-4 h-4" />
              Tài liệu hướng dẫn
            </button>
          </div>

          {/* ========== STATS CARDS ========== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">Lượng quét hôm nay</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {loading ? "—" : totalScans.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +12.5% so với hôm qua
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">Độ chính xác AI</p>
              <p className="text-3xl font-extrabold text-gray-900">98.4%</p>
              <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#065f46] rounded-full" style={{ width: "98.4%" }}></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">Người dùng Active</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {loading ? "—" : (totalActiveUsers >= 1000 ? `${(totalActiveUsers / 1000).toFixed(1)}k` : totalActiveUsers)}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Đang trực tuyến</span>
                <span className="text-gray-400 ml-1">{loading ? "" : Math.round(totalActiveUsers * 0.06).toLocaleString()}</span>
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium mb-1">Thời gian phản hồi</p>
              <p className="text-3xl font-extrabold text-gray-900">0.8s</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Tối ưu hoá: 99.9%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-12">
          Tính năng Quản trị <span className="bg-gradient-to-r from-[#065f46] to-[#059669] bg-clip-text text-transparent">Độc quyền</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Card 1: Dashboard Phân tích */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-[#065f46]" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Dashboard Phân tích</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Theo dõi lưu lượng quét, hành vi người dùng và phân bổ dinh dưỡng toàn cầu theo thời gian thực với biểu đồ tương tác 3D.
            </p>
            {/* Mini Chart */}
            <MiniBarChart />
          </div>

          {/* Feature Card 2: Quản lý Dữ liệu Thực phẩm */}
          <div className="bg-[#065f46] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Database className="w-5 h-5 text-emerald-200" />
            </div>
            <h3 className="font-bold text-lg mb-2">Quản lý Dữ liệu Thực phẩm</h3>
            <p className="text-emerald-200 text-sm leading-relaxed mb-5">
              Cơ sở dữ liệu và tinh chỉnh số liệu AI linh hoạt. Hỗ trợ hơn 1 triệu món ăn địa phương Việt Nam.
            </p>
            {/* Food items preview */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-lg shrink-0">🥗</div>
                <div>
                  <p className="font-semibold text-sm text-white">Bún Salad Cá Hồi</p>
                  <p className="text-[11px] text-emerald-300">Đã xác minh</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-lg shrink-0">🍜</div>
                <div>
                  <p className="font-semibold text-sm text-white">Bánh Mì Bơ</p>
                  <p className="text-[11px] text-emerald-300">Chờ duyệt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Card 3: Prompt Engine */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Prompt Engine</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Tối ưu hoá câu lệnh cho AI Vision để đạt độ chính xác cao nhất trong việc nhận diện khối lượng thực phẩm.
            </p>
            {/* Code Snippet */}
            <div className="bg-gray-900 rounded-xl p-4 text-xs font-mono text-emerald-400 leading-relaxed overflow-hidden">
              <div className="text-gray-500">// Vision Prompt V4.2</div>
              <div><span className="text-blue-400">IDENTIFY</span> [food_item] <span className="text-purple-400">AND</span> <span className="text-blue-400">ESTIMATE</span></div>
              <div>[weight_grams]</div>
              <div><span className="text-yellow-400">WITH</span> <span className="text-emerald-400">ACCURACY</span> {'>'} <span className="text-orange-400">95%</span>...</div>
            </div>
          </div>

          {/* Feature Card 4: Bảo mật Đa lớp */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Bảo mật Đa lớp</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Hệ thống bảo vệ dữ liệu người dùng đạt chuẩn quốc tế, mã hoá đầu cuối và quản lý quyền truy cập tập trung.
            </p>
          </div>
        </div>
      </section>

      {/* ========== TRUSTED BY SECTION ========== */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-6">
            Được tin dùng bởi các tổ chức hàng đầu
          </p>
          <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap">
            <div className="flex items-center gap-2 text-gray-400">
              <Heart className="w-5 h-5" />
              <span className="font-semibold text-sm">HealthOrg</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-5 h-5" />
              <span className="font-semibold text-sm">CyberSafe</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold text-sm">NutriData</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5" />
              <span className="font-semibold text-sm">BioTech</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="max-w-6xl mx-auto px-8 py-12">
        <div className="bg-gradient-to-r from-[#065f46] to-[#059669] rounded-3xl p-10 md:p-14 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            Nâng tầm quản trị sức khỏe cộng đồng
          </h2>
          <p className="text-emerald-200 text-sm md:text-base max-w-lg mx-auto mb-8">
            Sẵn sàng triển khai hệ thống AI thông minh nhất cho doanh nghiệp của bạn.
          </p>
          <button className="bg-white hover:bg-gray-50 text-[#065f46] font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm">
            Liên hệ tư vấn ngay
          </button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-gray-800 text-sm">AI NutriScan</span>
            <p className="text-xs text-gray-400 mt-0.5">© 2024 AI NutriScan. Built for Health.</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-700 transition-colors">Chính sách Bảo mật</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Điều khoản Dịch vụ</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Trung tâm Trợ giúp</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Tài liệu API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
