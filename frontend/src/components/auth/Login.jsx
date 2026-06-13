import React, { useState } from "react";
import { api } from "../../services/api";
import { Lock, Mail, ShieldAlert, CheckCircle, Leaf, Eye, EyeOff } from "lucide-react";

export default function Login({ onAuthSuccess, onRegisterToggle, initialEmail = "" }) {
  const [emailOrUsername, setEmailOrUsername] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.login(emailOrUsername, password);
      onAuthSuccess();
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#fcfefe] to-[#e6f9f0] flex flex-col items-center justify-between p-6 font-sans text-slate-800 relative overflow-hidden">
      {/* Decorative background glows - upper right */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#d1fae5] rounded-full blur-[120px] opacity-60 pointer-events-none"></div>

      {/* Top Header */}
      <header className="w-full flex justify-center py-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-[#026645]">
            <Leaf className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold text-[#026645] tracking-tight">AI NutriScan</span>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center w-full max-w-md relative z-10 my-8">
        <div className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(2,102,69,0.06)] border border-slate-100 p-8 md:p-10 flex flex-col">
          
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e293b] tracking-tight">
              Chào mừng bạn
            </h2>
            <p className="text-slate-500 text-sm mt-2 px-2 leading-relaxed">
              Đăng nhập để bắt đầu hành trình dinh dưỡng thông minh.
            </p>
          </div>

          {/* Notification alert states */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Social Logins at the top */}
          <div className="space-y-3">
            <button 
              type="button"
              onClick={() => alert("Chức năng đang được phát triển")}
              className="w-full flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all text-sm gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Tiếp tục với Google</span>
            </button>

            <button 
              type="button"
              onClick={() => alert("Chức năng đang được phát triển")}
              className="w-full flex items-center justify-center bg-[#1877f2] hover:bg-[#166fe5] active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all text-sm gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Tiếp tục với Facebook</span>
            </button>
          </div>

          {/* Separator */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-100"></div>
            <span className="px-4 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              hoặc Email
            </span>
            <div className="flex-1 border-t border-slate-100"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#026645] focus:bg-white rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none transition-all text-sm"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#026645] focus:bg-white rounded-xl py-3 pl-4 pr-10 text-slate-800 placeholder-slate-400 focus:outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#026645] hover:bg-[#015237] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg hover:shadow-emerald-900/10 transition-all text-sm mt-6 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Tiếp tục"}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-8 text-center text-sm text-slate-500">
            <span>Chưa có tài khoản?</span>
            <button
              type="button"
              onClick={onRegisterToggle}
              className="text-[#026645] font-bold hover:underline ml-1"
            >
              Đăng ký ngay
            </button>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full text-center py-4 relative z-10 text-xs text-slate-400">
        © 2024 AI NutriScan. Kết nối trí tuệ nhân tạo với sức khỏe của bạn.
      </footer>
    </div>
  );
}
