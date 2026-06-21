import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, Sparkles, Calendar, TrendingUp, MessageSquare, ArrowRight, Activity, ShieldAlert
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              AI NutriScan
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-all focus:outline-none"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] focus:outline-none"
            >
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Giải pháp sức khỏe tích hợp Trí tuệ nhân tạo
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
          Quét Thực Phẩm, Làm Chủ Dinh Dưỡng Bằng{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
            Gemini Vision AI
          </span>
        </h1>
        
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mt-6 leading-relaxed font-medium">
          Chỉ cần 1 bức ảnh đĩa thức ăn hoặc bao bì nhãn dinh dưỡng, AI sẽ phân tích ngay lập tức lượng Calo, dinh dưỡng đa lượng, phát hiện chất gây dị ứng và cảnh báo sức khỏe của bạn.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <button 
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
          >
            Trải nghiệm miễn phí
            <ArrowRight className="w-5 h-5" />
          </button>
          <a 
            href="#features"
            className="w-full sm:w-auto text-slate-300 hover:text-white font-bold text-sm border border-slate-800 hover:border-slate-700 bg-slate-950 px-8 py-4 rounded-2xl transition-all hover:bg-slate-900 focus:outline-none text-center"
          >
            Khám phá tính năng
          </a>
        </div>

        {/* Floating App Mockup Display */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl border border-slate-900 bg-slate-950/50 p-3 sm:p-4 backdrop-blur-md shadow-2xl relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/25 to-teal-500/25 rounded-3xl blur opacity-30 pointer-events-none"></div>
          <div className="rounded-2xl border border-slate-900/80 overflow-hidden bg-slate-900 aspect-video flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
              <span className="text-6xl mb-4 animate-bounce">🍎</span>
              <h3 className="text-xl sm:text-2xl font-black text-white">Hãy quét bất kỳ nhãn hoặc món ăn nào</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md font-semibold">
                AI sẽ trích xuất chi tiết lượng Calo, tinh bột, chất đạm, chất béo và đưa ra lời khuyên dinh dưỡng ngay lập tức.
              </p>
              <div className="mt-6 flex gap-3 flex-wrap justify-center">
                <span className="bg-slate-950/80 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-800 text-emerald-400 flex items-center gap-1.5 shadow-sm">
                  <Camera className="w-4 h-4" /> Food Vision
                </span>
                <span className="bg-slate-950/80 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-800 text-teal-400 flex items-center gap-1.5 shadow-sm">
                  <ShieldAlert className="w-4 h-4" /> Allergens Detection
                </span>
                <span className="bg-slate-950/80 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-800 text-emerald-400 flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-4 h-4" /> AI Meal Plan
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-900 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Tính Năng Nổi Bật Của Hệ Thống
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto font-medium">
            Mọi công cụ bạn cần để theo dõi sức khỏe và duy trì lối sống lành mạnh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-slate-950 border border-slate-900 rounded-3xl hover:border-emerald-500/30 transition-all hover:-translate-y-1 shadow-md hover:shadow-emerald-500/5 group">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Food Vision AI</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">
              Nhận diện chính xác tên món ăn tươi, cơm đĩa, bữa ăn gia đình chỉ qua hình ảnh để tính lượng Calo và dinh dưỡng đa lượng.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-slate-950 border border-slate-900 rounded-3xl hover:border-emerald-500/30 transition-all hover:-translate-y-1 shadow-md hover:shadow-emerald-500/5 group">
            <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Đọc nhãn bao bì & Dị ứng</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">
              Sử dụng OCR và AI để đọc trực tiếp bảng thành phần dinh dưỡng của bánh kẹo, snack, phát hiện cảnh báo dị ứng tức thì.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-slate-950 border border-slate-900 rounded-3xl hover:border-emerald-500/30 transition-all hover:-translate-y-1 shadow-md hover:shadow-emerald-500/5 group">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Thực đơn khuyến nghị AI</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">
              Tự động thiết lập thực đơn 3 bữa (Sáng/Trưa/Tối) cá nhân hóa hằng ngày dựa trên chỉ số BMI, cân nặng và chiều cao của bạn.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-slate-950 border border-slate-900 rounded-3xl hover:border-emerald-500/30 transition-all hover:-translate-y-1 shadow-md hover:shadow-emerald-500/5 group">
            <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Nhật ký & Biểu đồ</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold">
              Xem báo cáo phân tích Calo nạp vào tích lũy hàng tuần, quản lý chỉ số BMI và lịch sử sức khỏe một cách khoa học.
            </p>
          </div>
        </div>
      </section>

      {/* AI COACH INTRO */}
      <section className="py-20 px-6 bg-slate-950/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              Trò chuyện cùng chuyên gia ảo
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Tư vấn dinh dưỡng thông minh cùng AI Coach hằng ngày
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-6 leading-relaxed font-medium">
              Bạn phân vân không biết ăn gì để tăng cơ? Bạn cần lời khuyên về chế độ ăn kiêng hay giải pháp duy trì năng lượng?
            </p>
            <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed font-medium">
              Trò chuyện trực tiếp bằng Tiếng Việt với AI Coach tích hợp ngay góc màn hình để nhận tư vấn khoa học, ngắn gọn và thực tế nhất.
            </p>
            <button 
              onClick={() => navigate("/login")}
              className="mt-8 flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              Hỏi đáp AI Coach ngay
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-3xl p-5 shadow-xl relative">
            <div className="flex items-center gap-3 border-b border-slate-900 pb-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                🤖
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">AI Coach Dinh Dưỡng</h4>
                <p className="text-[10px] text-emerald-400 font-bold">Online</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto">
              <div className="bg-slate-900 text-slate-300 text-xs p-3 rounded-2xl self-end max-w-[85%] font-medium">
                Tôi nên ăn gì sau buổi tập để cơ bắp phục hồi nhanh vậy Coach?
              </div>
              <div className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-100 text-xs p-3 rounded-2xl self-start max-w-[85%] font-medium leading-relaxed">
                Sau tập bạn nên ưu tiên nạp Đạm (Protein) hấp thụ nhanh kèm tinh bột để bù cơ. Các món tốt như: ức gà áp chảo, lòng trắng trứng luộc, hoặc chuối chín kèm sữa nhé!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 px-6 text-center max-w-7xl mx-auto border-t border-slate-900 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Bắt Đầu Hành Trình Sức Khỏe Hôm Nay
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-lg mx-auto font-medium">
          Tham gia cùng chúng tôi để biến chiếc camera điện thoại thành trợ lý sức khỏe cá nhân thông minh nhất.
        </p>

        <button 
          onClick={() => navigate("/register")}
          className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
        >
          Trải nghiệm AI NutriScan miễn phí
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-6 text-center mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} AI NutriScan. Phát triển bởi Sinh viên thực tập SDC.
          </p>
          <div className="flex gap-4 text-xs text-slate-500 font-semibold">
            <span className="hover:text-slate-400 cursor-pointer">Điều khoản</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Bảo mật</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
