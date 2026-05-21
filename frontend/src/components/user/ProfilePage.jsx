import React, { useState } from "react";
import { api } from "../../services/api";
import {
  User, Shield, Globe, Trash2, ChevronRight, Lock, Wheat, Egg, Fish, Leaf, Sparkles
} from "lucide-react";

export default function ProfilePage() {
  const user = api.getUser();
  const userName = user?.fullName || user?.username || "Người dùng";
  const userEmail = user?.email || "email@example.com";

  const [height, setHeight] = useState("164");
  const [weight, setWeight] = useState("54.5");
  const [birthDate, setBirthDate] = useState("1998-05-15");
  const [goal, setGoal] = useState("maintain");

  // Diet & Allergy toggles
  const [allergies, setAllergies] = useState({
    gluten: false,
    dairy: true,
    seafood: false,
    vegan: false,
  });

  const toggleAllergy = (key) => {
    setAllergies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const bmi = weight && height ? (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1) : "—";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ========== LEFT COLUMN — Profile Card ========== */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center mb-4 relative">
              <span className="text-4xl font-extrabold text-teal-700">
                {userName.charAt(0).toUpperCase()}
              </span>
              <div className="absolute bottom-1 right-1 w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center border-2 border-white">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">{userName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{userEmail}</p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-teal-50 rounded-xl py-3 px-4 border border-teal-200">
                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Cân nặng</p>
                <p className="text-lg font-extrabold text-teal-700 mt-0.5">{weight} kg</p>
              </div>
              <div className="bg-gray-900 rounded-xl py-3 px-4">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">BMI</p>
                <p className="text-lg font-extrabold text-white mt-0.5">{bmi}</p>
              </div>
            </div>
          </div>

          {/* Health Index Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-gray-800 text-sm">Chỉ số sức khỏe</h3>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">Mục tiêu Calo</span>
                  <span className="font-bold text-gray-800">1,450 / 1,800 kcal</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">Nước uống</span>
                  <span className="font-bold text-gray-800">1.2 / 2.0 L</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== RIGHT COLUMN — Settings ========== */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Profile Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Cập nhật Hồ sơ</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Chiều cao (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Cân nặng (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Ngày sinh</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mục tiêu</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-800 focus:outline-none focus:border-teal-500 appearance-none cursor-pointer transition-all"
                >
                  <option value="maintain">Duy trì cân nặng</option>
                  <option value="lose">Giảm cân</option>
                  <option value="gain">Tăng cân</option>
                  <option value="muscle">Tăng cơ</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button className="bg-[#065f46] hover:bg-[#064e3b] text-white font-bold py-2.5 px-6 rounded-xl shadow-sm transition-colors text-sm">
                Lưu thay đổi
              </button>
            </div>
          </div>

          {/* Diet & Allergy Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-extrabold text-gray-900">Chế độ ăn & Dị ứng</h2>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 py-1.5 px-3 rounded-full border border-teal-200 hover:bg-teal-100 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
                Cá nhân hóa AI
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Chọn các thành phần bạn muốn tránh hoặc chế độ ăn đặc biệt để NutriScan cảnh báo khi quét thực phẩm.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gluten */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <Wheat className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-800">Gluten (Lúa mì)</span>
                </div>
                <button
                  onClick={() => toggleAllergy("gluten")}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors ${allergies.gluten ? "bg-teal-500" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${allergies.gluten ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Dairy */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <Egg className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-800">Sữa & Trứng (Dairy)</span>
                </div>
                <button
                  onClick={() => toggleAllergy("dairy")}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors ${allergies.dairy ? "bg-teal-500" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${allergies.dairy ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Seafood */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <Fish className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">Hải sản (Seafood)</span>
                </div>
                <button
                  onClick={() => toggleAllergy("seafood")}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors ${allergies.seafood ? "bg-teal-500" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${allergies.seafood ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Vegan */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">Ăn chay (Vegan)</span>
                </div>
                <button
                  onClick={() => toggleAllergy("vegan")}
                  className={`w-12 h-7 rounded-full p-0.5 transition-colors ${allergies.vegan ? "bg-teal-500" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${allergies.vegan ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Cài đặt Tài khoản</h2>

            <div className="flex flex-col divide-y divide-gray-100">
              <button className="flex items-center justify-between py-4 hover:bg-gray-50 px-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm">Đổi mật khẩu</p>
                    <p className="text-xs text-gray-500">Lần cuối cập nhật 3 tháng trước</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>

              <button className="flex items-center justify-between py-4 hover:bg-gray-50 px-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 text-sm">Ngôn ngữ</p>
                    <p className="text-xs text-gray-500">Tiếng Việt (Vietnam)</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>

              <button className="flex items-center justify-between py-4 hover:bg-gray-50 px-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-red-600 text-sm">Xóa tài khoản</p>
                    <p className="text-xs text-gray-500">Hành động này không thể hoàn tác</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
