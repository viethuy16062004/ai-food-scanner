import React, { useState } from "react";
import { api } from "../../services/api";
import { Lock, User, Mail, ShieldAlert, CheckCircle, ArrowRight, Timer, TrendingUp } from "lucide-react";
import registerHero from "../../assets/register_hero.png";

export default function LoginRegister({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(false); // Default to registration view as per user request
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        await api.login(emailOrUsername, password);
        onAuthSuccess();
      } else {
        // Register using email as both username and email to align with the form design
        await api.register(email, password, email, fullName);
        setSuccess("Đăng ký thành công! Đang chuyển sang đăng nhập...");
        // Auto-fill the email and switch to login
        const registeredEmail = email;
        setTimeout(() => {
          setIsLogin(true);
          setEmailOrUsername(registeredEmail);
          setPassword("");
          setError("");
          setSuccess("");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#eefdf6] via-[#f7fdfa] to-white flex items-center justify-center p-4 md:p-8 font-sans text-slate-800 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d1fae5] rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#d1fae5] rounded-full blur-[120px] opacity-60 pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Brand description & Hero showcase */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#026645] tracking-tight mb-4">
            AI NutriScan
          </h1>
          <p className="text-slate-600 text-sm lg:text-base max-w-md leading-relaxed mb-6">
            Hành trình sống khỏe thông minh bắt đầu từ đây. Quét thực phẩm, hiểu dinh dưỡng và đạt được mục tiêu vóc dáng lý tưởng.
          </p>
          
          {/* Main Hero Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 mb-6 bg-emerald-50 max-h-[340px] flex items-center justify-center">
            <img 
              src={registerHero} 
              alt="AI NutriScan Fresh Foods" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Side-by-side highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#026645]">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#026645] text-sm">Nhanh chóng</h3>
                <p className="text-slate-500 text-xs mt-0.5">Quét trong 2 giây</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#026645]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#026645] text-sm">Chính xác</h3>
                <p className="text-slate-500 text-xs mt-0.5">AI phân tích sâu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive card */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(2,102,69,0.06)] border border-slate-100 p-8 md:p-10 relative overflow-hidden flex flex-col">
            
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-24 h-1.5 bg-[#026645] rounded-br-lg"></div>

            {/* Header info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#026645] tracking-tight">
                {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {isLogin ? "Chào mừng trở lại! Hãy đăng nhập để tiếp tục." : "Gia nhập cộng đồng sống khỏe ngay hôm nay."}
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

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isLogin ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email hoặc Tên đăng nhập
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
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#026645] focus:bg-white rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#026645] focus:bg-white rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none transition-all text-sm"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#026645] focus:bg-white rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none transition-all text-sm"
                      placeholder="example@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-[#026645] focus:bg-white rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none transition-all text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#026645] hover:bg-[#015237] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg hover:shadow-emerald-900/10 transition-all text-sm mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Tiếp tục"}</span>
                {!loading && !isLogin && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Separator line */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-slate-100"></div>
              <span className="px-4 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {isLogin ? "Hoặc đăng nhập với" : "Hoặc đăng ký với"}
              </span>
              <div className="flex-1 border-t border-slate-100"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => alert("Chức năng đang được phát triển")}
                className="flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-bold py-3 px-4 rounded-xl shadow-sm transition-all text-sm"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>

              <button 
                type="button"
                onClick={() => alert("Chức năng đang được phát triển")}
                className="flex items-center justify-center bg-[#1877f2] hover:bg-[#166fe5] active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all text-sm"
              >
                <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Toggle login/register */}
            <div className="mt-8 text-center text-sm text-slate-500">
              <span>{isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}</span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                }}
                className="text-[#026645] font-bold hover:underline ml-1"
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
