import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Droplet, ChevronRight, Camera } from "lucide-react";

export default function HomePage({ user, onStartScan }) {
  const [analytics, setAnalytics] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getDailyAnalytics();
        setAnalytics(data);
        const scans = await api.getRecentScans(4);
        setRecentScans(scans || []);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "buổi sáng";
    if (hour < 18) return "buổi chiều";
    return "buổi tối";
  };

  const userName = user?.fullName || user?.name || user?.username || "Bạn";

  return (
    <div className="w-full bg-white">
      {/* GREETING SECTION */}
      <div className="mb-12 px-6">
        <h1 className="text-5xl font-bold text-teal-600 mb-3">
          Chào {getGreeting()}, {userName}!
        </h1>
        <p className="text-gray-600 text-base">
          Hôm nay bạn đang duy trì tốt quán lệ ăn uống. Cùng kiểm tra chỉ số nhé.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-6">
        {/* NĂNG LƯỢNG CARD */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-8">
            Năng lượng
          </h3>
          <div className="flex flex-col items-center">
            {/* Circular Progress */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#16a34a"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${
                    analytics
                      ? (analytics.todayCalories / analytics.targetCalories) * 100 * 4.4
                      : 0
                  } 439`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold text-teal-700">
                  {analytics ? Math.round(analytics.todayCalories) : 0}
                </span>
                <span className="text-xs text-gray-600 font-semibold">KCAL - ĐÃ NẠP</span>
              </div>
            </div>
            <p className="text-center text-gray-700 font-medium mb-2">
              Mục tiêu: {analytics ? Math.round(analytics.targetCalories) : 0} kcal
            </p>
            <p className="text-center text-teal-600 font-bold text-lg">
              {analytics ? Math.round((analytics.todayCalories / analytics.targetCalories) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* DINH DƯỠNG CARD */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-8">
            Dinh dưỡng da lượng
          </h3>
          <div className="space-y-6">
            {/* Carbs */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800">Carbs</span>
                <span className="text-sm text-gray-600">
                  {analytics ? Math.round(analytics.todayCarbs) : 0}g / {analytics ? Math.round(analytics.targetCarbs) : 0}g
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{
                    width: `${
                      analytics
                        ? Math.min((analytics.todayCarbs / analytics.targetCarbs) * 100, 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Protein */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800">Protein</span>
                <span className="text-sm text-gray-600">
                  {analytics ? Math.round(analytics.todayProtein) : 0}g / {analytics ? Math.round(analytics.targetProtein) : 0}g
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-700 rounded-full"
                  style={{
                    width: `${
                      analytics
                        ? Math.min((analytics.todayProtein / analytics.targetProtein) * 100, 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Chất béo */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800">Chất béo</span>
                <span className="text-sm text-gray-600">
                  {analytics ? Math.round(analytics.todayFat) : 0}g / {analytics ? Math.round(analytics.targetFat) : 0}g
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400 rounded-full"
                  style={{
                    width: `${
                      analytics
                        ? Math.min((analytics.todayFat / analytics.targetFat) * 100, 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Chất xơ */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800">Chất xơ</span>
                <span className="text-sm text-gray-600">
                  {analytics ? Math.round(analytics.todayFat * 0.5) : 0}g / {analytics ? Math.round(analytics.targetFat * 0.5) : 0}g
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full"
                  style={{
                    width: `${
                      analytics
                        ? Math.min((analytics.todayFat * 0.5 / (analytics.targetFat * 0.5)) * 100, 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* NƯỚC CARD */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Uống nước
          </h3>
          <p className="text-sm text-gray-600 mb-8">Mục tiêu: 2.5L</p>
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  i < 3
                    ? "bg-teal-100 border-teal-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Droplet
                  className={`w-6 h-6 ${
                    i < 3 ? "text-teal-500 fill-teal-500" : "text-gray-400"
                  }`}
                />
              </div>
            ))}
          </div>
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-base">
            Thêm 250ml
          </button>
        </div>
      </div>

      {/* QUÉT GẬN DÂY SECTION */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Quét gắn dây</h2>
          <button className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 transition-colors">
            Xem tất cả <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {recentScans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {recentScans.map((scan, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onStartScan && onStartScan(scan)}
              >
                {/* Food Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden rounded-t-2xl">
                  {scan.imageUrl ? (
                    <img
                      src={scan.imageUrl}
                      alt={scan.foodName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-100 to-gray-100">
                      <span className="text-gray-400 text-sm">Không có ảnh</span>
                    </div>
                  )}
                  {/* Score Badge */}
                  <div className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    {scan.healthyScore || 85} SCORE
                  </div>
                </div>

                {/* Food Info */}
                <div className="p-5">
                  <h4 className="font-bold text-gray-800 text-base mb-2 truncate">
                    {scan.foodName}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {scan.calories} kcal • {scan.protein}g Protein
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full border border-teal-300 text-xs font-medium">
                      {scan.category || "Thực phẩm"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center mb-8">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <ChevronRight className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có quét nào</h3>
            <p className="text-gray-600 mb-6">
              Hãy bắt đầu quét thực phẩm để theo dõi dinh dưỡng của bạn
            </p>
            <button
              onClick={onStartScan}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
            >
              Bắt đầu quét
            </button>
          </div>
        )}
      </div>

      {/* FLOATING CAMERA BUTTON */}
      <button
        onClick={() => onStartScan && onStartScan()}
        className="fixed bottom-8 right-8 w-16 h-16 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
      >
        <Camera className="w-8 h-8" />
      </button>
    </div>
  );
}
