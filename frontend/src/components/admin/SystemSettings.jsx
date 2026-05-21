import React, { useState } from "react";
import { Key, Save, Edit3, Trash2, ShieldAlert, CheckCircle2, RefreshCw, Cpu } from "lucide-react";

export default function SystemSettings() {
  const [googleKey, setGoogleKey] = useState("••••••••••••••••••••••••••••••••••••");
  const [openAiKey, setOpenAiKey] = useState("");
  const [awsKey, setAwsKey] = useState("••••••••••••••••••••••••••••••••");

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ========== LEFT COLUMN ========== */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* API Key Management */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Key className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">API Key Management</h2>
                  <p className="text-sm text-gray-500">Quản lý kết nối với các mô hình AI</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
                Làm mới tất cả
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Google Gemini */}
              <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors hover:bg-gray-50">
                <div className="flex-1 w-full">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Google Gemini API</p>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={googleKey} 
                      readOnly
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-700 font-mono focus:outline-none"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 sm:mt-6">
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    Hoạt động
                  </span>
                  <button className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* OpenAI */}
              <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors hover:bg-gray-50">
                <div className="flex-1 w-full">
                  <p className="text-sm font-semibold text-gray-800 mb-2">OpenAI (GPT-4o)</p>
                  <input 
                    type="text" 
                    value={openAiKey}
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    placeholder="Nhập API Key mới..."
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-700 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3 shrink-0 sm:mt-6">
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full">
                    Chưa thiết lập
                  </span>
                  <button className="px-4 py-2 bg-[#065f46] hover:bg-[#064e3b] text-white rounded-xl text-sm font-semibold transition-colors">
                    Lưu
                  </button>
                </div>
              </div>

              {/* AWS S3 */}
              <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors hover:bg-gray-50">
                <div className="flex-1 w-full">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Cloud Storage (AWS S3/Firebase)</p>
                  <input 
                    type="password" 
                    value={awsKey} 
                    readOnly
                    className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-sm text-gray-700 font-mono focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 shrink-0 sm:mt-6">
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    Kết nối
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System Instruction Editor */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">System Instruction Editor</h2>
                <p className="text-sm text-gray-500">Tinh chỉnh AI Vision Prompt (Lõi xử lý hình ảnh)</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <span className="text-sm font-bold text-emerald-700">Global Vision Prompt</span>
                <span className="text-[11px] font-mono text-gray-400">v2.4.1 Last Update: 2 giờ trước</span>
              </div>
              <textarea 
                className="w-full h-48 p-4 text-sm text-gray-700 font-mono leading-relaxed bg-white focus:outline-none resize-none"
                defaultValue={`Bạn là một chuyên gia dinh dưỡng AI cao cấp. Khi nhận được hình ảnh món ăn, hãy phân tích chi tiết: 1. Tên món, 2. Thành phần ước tính, 3. Chỉ số Calo, Protein, Carbs, Fat. 4. Cảnh báo nếu có chất gây dị ứng hoặc vượt ngưỡng an toàn...`}
              />
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">#CALORIES_DETECTION</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">#VIETNAMESE_CUISINE</span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">#PRECISION_MODE</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                Hủy bỏ
              </button>
              <button className="px-6 py-2.5 bg-[#065f46] hover:bg-[#064e3b] text-white rounded-xl text-sm font-semibold transition-colors">
                Cập nhật Instruction
              </button>
            </div>
          </div>

        </div>

        {/* ========== RIGHT COLUMN ========== */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Warning Thresholds */}
          <div className="bg-white rounded-3xl border-2 border-red-50 shadow-sm p-8 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Warning Thresholds</h2>
            </div>

            <div className="flex flex-col gap-8 flex-1">
              {/* Sugar */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-800">Ngưỡng Đường (Sugar)</span>
                  <span className="text-sm font-bold text-red-600">15g</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2 relative">
                  <div className="absolute top-0 left-0 h-full w-[80%] bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Cảnh báo "High Sugar" khi phát hiện thành phần {'>'} 15g.
                </p>
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-800">Ngưỡng Chất béo (Fat)</span>
                  <span className="text-sm font-bold text-orange-500">25g</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2 relative">
                  <div className="absolute top-0 left-0 h-full w-[60%] bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Gửi thông báo nhắc nhở khi món ăn quá nhiều dầu mỡ.
                </p>
              </div>

              {/* Sodium */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-800">Natri (Sodium)</span>
                  <span className="text-sm font-bold text-gray-600">1200mg</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2 relative">
                  <div className="absolute top-0 left-0 h-full w-[90%] bg-gray-400 rounded-full"></div>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Mức độ cảnh báo mặn đối với người dùng cao huyết áp.
                </p>
              </div>
            </div>

            <button className="w-full mt-8 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2">
              <span>+</span> Thêm ngưỡng cảnh báo mới
            </button>
          </div>

          {/* System Info Mini Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Thông tin hệ thống</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Phiên bản UI</span>
                <span className="text-sm font-bold text-gray-900">v1.0.4-Emerald</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Region</span>
                <span className="text-sm font-bold text-gray-900">Vietnam (HCM)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Server Status</span>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 99.9%
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Simple EyeIcon component since it's missing in some lucide-react versions, or we can just import Eye from lucide-react
function EyeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
