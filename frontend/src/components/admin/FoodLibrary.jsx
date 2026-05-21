import React from "react";
import { Search, Bell, UserCircle, Plus, Filter, AlertCircle, Eye, CheckCircle2 } from "lucide-react";

export default function FoodLibrary() {
  const flaggedItems = [
    { id: "4920", name: "Salad Cá Hồi", reason: "Ai nhận diện nhầm cá hồi thành đậu phụ. Calo bị sai...", user: "@HoangTran", img: "🥗" },
    { id: "5183", name: "Pizza Pepperoni", reason: "Không nhận diện được kích thước đế bánh, calo...", user: "@MinhNguyet", img: "🍕" },
    { id: "4882", name: "Ức Gà Áp Chảo", reason: "Mô tả nguyên liệu bị sai so với thực tế ảnh chụp.", user: "@TuanAnh", img: "🍗" },
  ];

  const aiFoods = [
    { name: "Dứa tươi", category: "Trái cây", calo: "50 kcal", protein: "0.5g", carbs: "13.1g", fat: "0.1g", status: "Đã xác thực", img: "🍍" },
    { name: "Ức gà nướng", category: "Thịt & Đạm", calo: "165 kcal", protein: "31.0g", carbs: "0g", fat: "3.6g", status: "Đang học", img: "🍗" },
    { name: "Bông cải xanh", category: "Rau củ", calo: "34 kcal", protein: "2.8g", carbs: "6.6g", fat: "0.4g", status: "Đã xác thực", img: "🥦" },
  ];

  return (
    <div className="p-8 w-full">
      {/* Flagged Items Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Yêu cầu điều phối (Flagged)</h2>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">12</span>
          </div>
          <button className="text-sm font-semibold text-[#065f46] hover:text-[#064e3b] flex items-center gap-1">
            Xem tất cả <span className="text-lg">›</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flaggedItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border-2 border-red-100 p-5 shadow-sm hover:border-red-200 transition-colors flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                  {item.img}
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                    <span className="text-[10px] text-gray-400 font-mono mt-1 shrink-0">ID: #{item.id}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">"{item.reason}"</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-5">
                <UserCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-gray-500">Người dùng: <span className="font-semibold text-gray-700">{item.user}</span></span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <button className="flex-1 bg-[#065f46] hover:bg-[#064e3b] text-white py-2 rounded-xl text-sm font-semibold transition-colors">
                  Duyệt lại
                </button>
                <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header / Toolbar */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Danh sách Thực phẩm AI</h2>
            <p className="text-sm text-gray-500 mt-1">Tổng số: 1,248 mặt hàng trong cơ sở dữ liệu</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4a6b5d] hover:bg-[#3d5a4e] text-white rounded-xl font-semibold text-sm transition-colors">
              <Plus className="w-4 h-4" />
              Thêm mới
            </button>
            <button className="w-10 h-10 border border-gray-200 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Tên thực phẩm</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Calo (100g)</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Protein (g)</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Carbs (g)</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Fats (g)</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider">Trạng thái AI</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {aiFoods.map((f, i) => (
                <tr key={i} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                        {f.img}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{f.name}</p>
                        <p className="text-xs text-gray-500">{f.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{f.calo}</td>
                  <td className="px-6 py-4 font-mono text-gray-600">{f.protein}</td>
                  <td className="px-6 py-4 font-mono text-gray-600">{f.carbs}</td>
                  <td className="px-6 py-4 font-mono text-gray-600">{f.fat}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold ${
                      f.status === 'Đã xác thực' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600 px-2 py-1">...</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="p-6 flex items-center justify-between border-t border-gray-50 bg-white">
          <span className="text-sm text-gray-500">Hiển thị 1-10 của 1,248</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">{'<'}</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#065f46] text-white font-bold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-bold text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-bold text-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">{'>'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
