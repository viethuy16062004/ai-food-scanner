import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { api } from "../../services/api";
import { Camera, Upload, Trash2, CheckCircle, AlertTriangle, Shield, ChevronRight } from "lucide-react";

export default function ScanFoodPage({ onScanSuccess, onBack }) {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCamera, setHasCamera] = useState(true);
  const [detectedFood, setDetectedFood] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;
    setError("");
    setScanResult(null);
    setLoading(true);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Không thể chụp ảnh từ Camera. Hãy thử tải ảnh lên.");
      }

      setCapturedImage(imageSrc);
      setDetectedFood("Đang nhận diện...");

      console.log("Image captured from camera. Analyzing...");
      const result = await api.scanFoodImage(imageSrc);

      if (result.success && result.analysis) {
        if (result.analysis.isFood === false) {
          setError(result.analysis.summary || "Ảnh không chứa thực phẩm có thể nhận diện.");
          setDetectedFood(null);
        } else {
          setDetectedFood(`Đã nhận diện: ${result.analysis.foodName}`);
          setScanResult({
            ...result.analysis,
            imageUrl: imageSrc,
            savedToHistory: result.savedToHistory
          });
        }
      } else {
        throw new Error("Kết quả trả về không hợp lệ.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Không thể phân tích ảnh.");
      setDetectedFood(null);
    } finally {
      setLoading(false);
    }
  }, [webcamRef]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setScanResult(null);
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageSrc = event.target?.result;
        setCapturedImage(imageSrc);
        setDetectedFood("Đang nhận diện...");

        try {
          console.log("File uploaded: " + file.name + ". Analyzing...");
          const result = await api.scanFoodImage(file);

          if (result.success && result.analysis) {
            if (result.analysis.isFood === false) {
              setError(result.analysis.summary || "Ảnh không chứa thực phẩm có thể nhận diện.");
              setDetectedFood(null);
            } else {
              setDetectedFood(`Đã nhận diện: ${result.analysis.foodName}`);
              setScanResult({
                ...result.analysis,
                imageUrl: imageSrc,
                savedToHistory: result.savedToHistory
              });
            }
          } else {
            throw new Error("Kết quả trả về không hợp lệ.");
          }
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.error || err.message || "Không thể phân tích ảnh.");
          setDetectedFood(null);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải file");
      setLoading(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const clearCapture = () => {
    setCapturedImage(null);
    setDetectedFood(null);
    setScanResult(null);
    setError("");
  };

  const handleCameraError = () => {
    setHasCamera(false);
  };

  const videoConstraints = {
    width: 640,
    height: 640,
    facingMode: facingMode
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT SIDE - Camera Scanner */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Quét thực phẩm AI</h1>
            </div>

            {/* Camera Preview Box */}
            <div className="relative w-full aspect-square bg-[#0c1613] rounded-3xl overflow-hidden border-4 border-emerald-700 shadow-lg flex items-center justify-center mb-6">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-emerald-500 z-10 rounded-tl-md"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-emerald-500 z-10 rounded-tr-md"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-emerald-500 z-10 rounded-bl-md"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-emerald-500 z-10 rounded-br-md"></div>

              {/* Camera or captured image */}
              {capturedImage ? (
                <div className="w-full h-full relative">
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  {detectedFood && (
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-slate-100">
                      • {detectedFood.replace("Đã nhận diện: ", "")}
                    </div>
                  )}
                </div>
              ) : hasCamera ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  onUserMediaError={handleCameraError}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-white text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-300" />
                  <p className="text-slate-400 font-semibold text-sm">Camera không khả dụng</p>
                </div>
              )}

              {/* QR Code style sweep line and gradient trail to indicate active scanner */}
              {!capturedImage && hasCamera && !loading && (
                <div className="absolute left-0 right-0 h-28 bg-gradient-to-t from-emerald-500/15 via-emerald-500/5 to-transparent border-b-2 border-emerald-400/80 shadow-[0_4px_15px_rgba(16,185,129,0.25)] animate-qr-scan pointer-events-none z-10"></div>
              )}

              {/* AI Scanning Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center z-20">
                  {/* Glowing QR Scanner Sweep Line and Trail (Cyan/Emerald) */}
                  <div className="absolute left-0 right-0 h-32 bg-gradient-to-t from-emerald-400/25 via-emerald-500/10 to-transparent border-b-2 border-emerald-300 shadow-[0_6px_20px_rgba(52,211,153,0.4)] animate-qr-scan pointer-events-none"></div>
                  
                  {/* Cyber/AI Grid background pattern overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                  {/* Scanning Crosshair/Reticle in the center */}
                  <div className="relative w-48 h-48 border border-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-40 h-40 border border-dashed border-emerald-500/30 rounded-full flex items-center justify-center">
                      <div className="w-32 h-32 border border-emerald-500/40 rounded-full flex items-center justify-center bg-emerald-950/30">
                        {/* Scanning icon with rotating ring */}
                        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
                      </div>
                    </div>
                    {/* Reticle ticks */}
                    <div className="absolute top-0 w-0.5 h-3 bg-emerald-400"></div>
                    <div className="absolute bottom-0 w-0.5 h-3 bg-emerald-400"></div>
                    <div className="absolute left-0 w-3 h-0.5 bg-emerald-400"></div>
                    <div className="absolute right-0 w-3 h-0.5 bg-emerald-400"></div>
                  </div>

                  {/* Status Texts */}
                  <div className="mt-8 text-center px-4 z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                      <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                      <span className="text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase">
                        AI_SCANNER: ACTIVE
                      </span>
                    </div>
                    <p className="text-white font-extrabold text-sm mt-3 tracking-wide drop-shadow-md">
                      ĐANG QUÉT DINH DƯỠNG...
                    </p>
                  </div>
                </div>
              )}

              {/* Center Camera Button */}
              {!capturedImage && (
                <button
                  onClick={handleCapture}
                  disabled={loading}
                  className="absolute bottom-6 w-16 h-16 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-full shadow-2xl flex items-center justify-center z-20 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 border border-slate-200"
                >
                  <div className="w-12 h-12 border-4 border-slate-300 rounded-full flex items-center justify-center bg-slate-50">
                    <div className="w-6 h-6 bg-emerald-700 rounded-full animate-pulse"></div>
                  </div>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={toggleCamera}
                disabled={loading || capturedImage}
                className="flex items-center gap-2 bg-[#047857] hover:bg-[#065f46] text-white font-bold py-3 px-6 rounded-2xl transition-all disabled:opacity-50 text-sm focus:outline-none"
              >
                <Camera className="w-4 h-4" />
                Máy ảnh
              </button>

              {capturedImage && (
                <button
                  onClick={clearCapture}
                  className="flex items-center justify-center w-12 h-12 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl border border-rose-100 hover:border-rose-200 transition-colors focus:outline-none"
                  title="Xóa ảnh chụp"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-[#047857] rounded-2xl text-sm font-semibold flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#047857] border-t-transparent rounded-full animate-spin"></div>
                Đang phân tích hình ảnh thực phẩm bằng AI...
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-slate-300/80 rounded-3xl p-6 sm:p-10 text-center bg-white shadow-sm hover:border-emerald-500 transition-all duration-300">
              <Upload className="w-12 h-12 text-[#047857] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">Tải ảnh thực phẩm lên</h3>
              <p className="text-slate-400 text-xs mb-6 font-medium">Hỗ trợ JPG, PNG (Tối đa 10MB)</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-3 px-6 rounded-2xl transition-colors disabled:opacity-50 text-sm focus:outline-none min-h-[44px]"
              >
                Chọn từ thiết bị
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* RIGHT SIDE - Results Panel */}
          <div className="lg:col-span-2">
            {/* Results Header */}
            <div className="bg-[#047857] rounded-3xl p-5 mb-6 shadow-sm">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                Kết quả phân tích sơ bộ
              </div>
            </div>

            {/* Results Content */}
            {scanResult ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-slate-800 text-base">{scanResult.foodName}</h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                    scanResult.healthyScore >= 80 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                      : scanResult.healthyScore >= 60 
                        ? "bg-amber-50 text-amber-700 border-amber-200" 
                        : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                    {scanResult.healthyScore} Điểm
                  </span>
                </div>

                {/* Nutrient Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-4 rounded-2xl mb-4 text-center border border-slate-100/50">
                  <div>
                    <span className="block text-sm font-extrabold text-slate-800">{Math.round(scanResult.calories)}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Kcal</span>
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-800">{Math.round(scanResult.protein)}g</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Đạm</span>
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-800">{Math.round(scanResult.carbs)}g</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Tinh bột</span>
                  </div>
                  <div>
                    <span className="block text-sm font-extrabold text-slate-800">{Math.round(scanResult.fat)}g</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Béo</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-6 font-semibold">
                  {scanResult.summary}
                </p>

                <button
                  onClick={() => onScanSuccess(scanResult)}
                  className="w-full bg-[#047857] hover:bg-[#065f46] text-white font-bold py-3.5 px-4 rounded-2xl transition-all hover:shadow-md active:scale-[0.98] text-sm flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  Xem phân tích chi tiết
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-6">
                <p className="text-slate-400 text-center italic text-xs leading-relaxed font-semibold">
                  Chụp hoặc tải ảnh thực phẩm lên để AI NutriScan bắt đầu phân tích dinh dưỡng...
                </p>
              </div>
            )}

            {/* Tips Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 mb-5">Mẹo quét chuẩn</h3>

              <div className="space-y-4">
                {/* Tip 1 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-xs leading-normal">
                      Đảm bảo đủ ánh sáng để AI nhận diện màu sắc thực phẩm tốt nhất.
                    </p>
                  </div>
                </div>

                {/* Tip 2 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-xs leading-normal">
                      Đặt thực phẩm ở giữa khung hình, tránh bị che khuất.
                    </p>
                  </div>
                </div>

                {/* Tip 3 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-xs leading-normal">
                      Với bữa ăn nhiều món, hãy quét từng món riêng biệt để chính xác hơn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
