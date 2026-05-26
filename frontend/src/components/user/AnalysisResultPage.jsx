import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Bell, User, AlertTriangle, CheckCircle, Zap, Sparkles,
  Share2, BookmarkCheck, ChevronRight
} from "lucide-react";

// Donut chart rendered with SVG
function DonutChart({ protein, carbs, fat }) {
  const total = protein + carbs + fat;
  if (total === 0) return null;

  const proteinPct = (protein / total) * 100;
  const carbsPct = (carbs / total) * 100;
  const fatPct = (fat / total) * 100;

  const radius = 80;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  const proteinDash = (proteinPct / 100) * circumference;
  const carbsDash = (carbsPct / 100) * circumference;
  const fatDash = (fatPct / 100) * circumference;

  const proteinOffset = 0;
  const carbsOffset = -(proteinDash);
  const fatOffset = -(proteinDash + carbsDash);

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
      {/* Protein arc */}
      <circle
        cx="100" cy="100" r={radius}
        fill="none"
        stroke="#0d9488"
        strokeWidth={strokeWidth}
        strokeDasharray={`${proteinDash} ${circumference - proteinDash}`}
        strokeDashoffset={proteinOffset}
        strokeLinecap="round"
      />
      {/* Carbs arc */}
      <circle
        cx="100" cy="100" r={radius}
        fill="none"
        stroke="#f59e0b"
        strokeWidth={strokeWidth}
        strokeDasharray={`${carbsDash} ${circumference - carbsDash}`}
        strokeDashoffset={carbsOffset}
        strokeLinecap="round"
      />
      {/* Fat arc */}
      <circle
        cx="100" cy="100" r={radius}
        fill="none"
        stroke="#06b6d4"
        strokeWidth={strokeWidth}
        strokeDasharray={`${fatDash} ${circumference - fatDash}`}
        strokeDashoffset={fatOffset}
        strokeLinecap="round"
      />
    </svg>
  );
}

// Health score donut
function HealthScoreDonut({ score }) {
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return "#0d9488";
    if (s >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getLabel = (s) => {
    if (s >= 80) return "Tuyệt vời";
    if (s >= 60) return "Khá tốt";
    if (s >= 40) return "Bình thường";
    return "Cần cải thiện";
  };

  return (
    <div className="relative w-[180px] h-[180px] flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
        <circle
          cx="90" cy="90" r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth}
        />
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference - progress}`}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-gray-800">{score}</span>
        <span className="text-sm font-semibold text-gray-500">{getLabel(score)}</span>
      </div>
    </div>
  );
}

export default function AnalysisResultPage({ scanResult, onBack }) {
  const navigate = useNavigate();

  if (!scanResult) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-gray-500">Không có dữ liệu phân tích. Vui lòng quét thực phẩm trước.</p>
        <button
          onClick={() => navigate("/scan")}
          className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-colors"
        >
          Quét ngay
        </button>
      </div>
    );
  }

  const {
    foodName = "Thực phẩm",
    calories = 0,
    protein = 0,
    carbs = 0,
    fat = 0,
    healthyScore = 0,
    summary = "",
    warnings = [],
    allergens = [],
    benefits = [],
    imageUrl = "",
    alternatives = [],
    category = ""
  } = scanResult;

  const totalMacro = protein + carbs + fat;
  const proteinPct = totalMacro > 0 ? Math.round((protein / totalMacro) * 100) : 0;
  const carbsPct = totalMacro > 0 ? Math.round((carbs / totalMacro) * 100) : 0;
  const fatPct = totalMacro > 0 ? Math.round((fat / totalMacro) * 100) : 0;

  const getNutritionLabel = (score) => {
    if (score >= 80) return "Dinh dưỡng cao";
    if (score >= 60) return "Dinh dưỡng khá";
    if (score >= 40) return "Dinh dưỡng trung bình";
    return "Dinh dưỡng thấp";
  };

  const getNutritionLabelColor = (score) => {
    if (score >= 80) return "bg-teal-100 text-teal-700 border-teal-300";
    if (score >= 60) return "bg-amber-100 text-amber-700 border-amber-300";
    if (score >= 40) return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* TOP HEADER BAR */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-gray-800">Kết quả phân tích</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ========== LEFT COLUMN ========== */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Food Image Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="relative h-56 bg-gradient-to-br from-teal-50 to-emerald-50 overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt={foodName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-teal-100 rounded-2xl flex items-center justify-center mb-2">
                        <Sparkles className="w-10 h-10 text-teal-500" />
                      </div>
                      <span className="text-sm text-gray-400">{foodName}</span>
                    </div>
                  </div>
                )}
                {/* Food Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h2 className="text-white font-bold text-lg drop-shadow-md">{foodName}</h2>
                </div>
              </div>

              {/* Summary */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-gray-800 text-sm">Đánh giá chung</h3>
                  <span className={`text-xs font-semibold py-1 px-2.5 rounded-full border ${getNutritionLabelColor(healthyScore)}`}>
                    {getNutritionLabel(healthyScore)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {summary || "Chưa có thông tin đánh giá chi tiết cho món ăn này."}
                </p>
              </div>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-teal-100">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Phân tích từ AI</h3>
              </div>

              <div className="flex flex-col gap-3">
                {benefits && benefits.length > 0 ? (
                  benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-relaxed">{b}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Chưa có dữ liệu phân tích chi tiết.</p>
                )}

                {warnings && warnings.length > 0 && warnings.map((w, idx) => (
                  <div key={`w-${idx}`} className="flex items-start gap-2.5">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 leading-relaxed">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========== CENTER COLUMN ========== */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Health Score Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
              <h3 className="font-bold text-gray-800 text-base mb-4">Điểm Sức Khỏe</h3>
              <HealthScoreDonut score={healthyScore} />

              {/* Macro Summary */}
              <div className="flex items-center justify-center gap-6 mt-6 w-full">
                <div className="text-center">
                  <span className="text-2xl font-extrabold text-teal-700">{calories}</span>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Calo</p>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                  <span className="text-2xl font-extrabold text-teal-700">{protein}g</span>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Protein</p>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                  <span className="text-2xl font-extrabold text-teal-700">{carbs}g</span>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Carbs</p>
                </div>
              </div>
            </div>

            {/* Detailed Calorie Analysis Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Phân tích mức độ Calo</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Mức năng lượng:</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                  calories < 200 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : calories <= 500 
                      ? "bg-amber-50 text-amber-700 border-amber-200" 
                      : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {calories < 200 ? "Thấp (Low-Cal)" : calories <= 500 ? "Trung bình (Moderate)" : "Cao (High-Cal)"}
                </span>
              </div>
              
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex mb-3">
                <div className={`h-full rounded-full transition-all duration-500 ${
                  calories < 200 
                    ? "bg-green-500" 
                    : calories <= 500 
                      ? "bg-amber-500" 
                      : "bg-red-500"
                }`} style={{ width: `${Math.min((calories / 800) * 100, 100)}%` }}></div>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                {calories < 200 
                  ? "Món ăn này có mật độ năng lượng thấp, rất tốt cho việc giảm cân hoặc làm bữa ăn nhẹ mà không lo dư thừa calo."
                  : calories <= 500 
                    ? "Lượng calo ở mức vừa phải, lý tưởng cho một bữa ăn chính nhẹ nhàng hoặc bữa ăn bổ sung năng lượng sau khi tập luyện."
                    : "Đây là món ăn có hàm lượng calo cao. Hãy kiểm soát khẩu phần ăn và kết hợp vận động để duy trì cân nặng hợp lý."}
              </p>
            </div>

            {/* Macro Distribution Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 text-base mb-4">Phân bổ đại dưỡng chất</h3>

              <div className="flex items-center gap-6">
                {/* Donut */}
                <div className="shrink-0">
                  <DonutChart protein={protein} carbs={carbs} fat={fat} />
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-teal-600"></span>
                      <span className="text-sm text-gray-700">Protein ({proteinPct}%)</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{protein}g</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-sm text-gray-700">Carbs ({carbsPct}%)</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{carbs}g</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                      <span className="text-sm text-gray-700">Fat ({fatPct}%)</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{fat}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== RIGHT COLUMN ========== */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Allergen Warning Card */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-amber-800 text-sm">Cảnh báo dị ứng</h3>
              </div>

              {allergens && allergens.length > 0 ? (
                <div className="flex flex-col gap-2 mb-3">
                  {allergens.map((a, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center bg-amber-100 text-amber-800 text-xs font-bold py-1.5 px-3 rounded-lg border border-amber-300 w-fit"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-amber-700 mb-3">Không phát hiện chất gây dị ứng phổ biến.</p>
              )}

              <p className="text-sm text-amber-700 italic leading-relaxed">
                {allergens && allergens.length > 0
                  ? "Lưu ý: Món ăn này có chứa gia vị cay nhẹ, có thể gây kích ứng da dày nhạy cảm."
                  : "Vẫn nên kiểm tra kỹ thành phần nếu bạn có tiền sử dị ứng thực phẩm."
                }
              </p>
            </div>

            {/* Alternative Suggestions Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Lựa chọn thay thế</h3>

              <div className="flex flex-col gap-3">
                {/* Suggestion 1 */}
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 overflow-hidden">
                    <span className="text-lg">🥗</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">Salad Đậu Gà</p>
                    <p className="text-xs text-gray-500">Ít béo hơn 20%</p>
                  </div>
                </div>

                {/* Suggestion 2 */}
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 overflow-hidden">
                    <span className="text-lg">🥘</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">Bowl Địa Trung Hải</p>
                    <p className="text-xs text-gray-500">Nhiều Protein hơn</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 py-2.5 px-4 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-1">
                Xem tất cả gợi ý
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========== BOTTOM ACTION BUTTONS ========== */}
        <div className="flex items-center justify-center gap-4 mt-8 mb-4">
          <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm">
            <BookmarkCheck className="w-5 h-5" />
            Lưu vào nhật ký ăn uống
          </button>
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-8 rounded-2xl border border-gray-300 hover:border-gray-400 shadow-sm transition-all text-sm">
            <Share2 className="w-5 h-5" />
            Chia sẻ kết quả
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-gray-800 text-sm">AI NutriScan</span>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Help Center</a>
          </div>
          <span className="text-xs text-gray-400">© 2024 AI NutriScan. Built for Health.</span>
        </div>
      </footer>
    </div>
  );
}
