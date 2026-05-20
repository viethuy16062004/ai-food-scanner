import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { api } from "../../services/api";
import { Camera, Upload, Trash2, CheckCircle, AlertTriangle, Shield } from "lucide-react";

export default function ScanFoodPage({ onScanSuccess, onBack }) {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCamera, setHasCamera] = useState(true);
  const [detectedFood, setDetectedFood] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;
    setError("");
    setLoading(true);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Không thể chụp ảnh từ Camera. Hãy thử tải ảnh lên.");
      }

      setCapturedImage(imageSrc);
      setDetectedFood("Đang nhận diện: Salad tuối");

      console.log("Image captured from camera. Analyzing...");
      const result = await api.scanFoodImage(imageSrc);

      if (result.success && result.analysis) {
        if (result.analysis.isFood === false) {
          setError(result.analysis.summary || "Ảnh không chứa thực phẩm có thể nhận diện.");
          setDetectedFood(null);
        } else {
          setDetectedFood(`Đang nhận diện: ${result.analysis.foodName}`);
          setTimeout(() => {
            onScanSuccess(result.analysis);
          }, 1000);
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
  }, [webcamRef, onScanSuccess]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
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
              setDetectedFood(`Đang nhận diện: ${result.analysis.foodName}`);
              setTimeout(() => {
                onScanSuccess(result.analysis);
              }, 1000);
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
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT SIDE - Camera Scanner */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Quét thực phẩm AI</h1>

            {/* Camera Preview Box */}
            <div className="relative w-full aspect-square bg-black rounded-3xl overflow-hidden border-4 border-teal-600 shadow-2xl flex items-center justify-center mb-6">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-3 border-l-3 border-teal-500 z-10"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-3 border-r-3 border-teal-500 z-10"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-3 border-l-3 border-teal-500 z-10"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-3 border-r-3 border-teal-500 z-10"></div>

              {/* Camera or captured image */}
              {capturedImage ? (
                <div className="w-full h-full relative">
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  {detectedFood && (
                    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur text-gray-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      • {detectedFood.replace("Đang nhận diện: ", "")}
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
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Camera không khả dụng</p>
                </div>
              )}

              {/* Center Camera Button */}
              <button
                onClick={handleCapture}
                disabled={loading || capturedImage}
                className="absolute bottom-8 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center z-20 hover:scale-110 transition-transform disabled:opacity-50"
              >
                <div className="w-12 h-12 border-4 border-gray-300 rounded-full flex items-center justify-center bg-gray-100">
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                </div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={toggleCamera}
                disabled={loading || capturedImage}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-full transition-colors disabled:opacity-50"
              >
                <Camera className="w-5 h-5" />
                Máy ảnh
              </button>

              {capturedImage && (
                <button
                  onClick={clearCapture}
                  className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="mb-6 p-4 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg text-sm">
                Đang phân tích ảnh...
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50">
              <Upload className="w-12 h-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Kéo và thả ảnh tại đây</h3>
              <p className="text-gray-600 text-sm mb-6">Hỗ trợ JPG, PNG (Tối đa 10MB)</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-8 rounded-full transition-colors disabled:opacity-50"
              >
                Chọn từ máy tính
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
            <div className="bg-teal-500 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 text-white font-semibold text-lg">
                <AlertTriangle className="w-6 h-6" />
                Kết quả phân tích
              </div>
            </div>

            {/* Results Content */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-6">
              <p className="text-gray-700 text-center italic text-sm leading-relaxed">
                Chup hoặc tải ảnh thực phẩm đó AI NutriScan bắt đầu phân tích định dưỡng...
              </p>
            </div>

            {/* Tips Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Mẹo quét chuẩn</h3>

              <div className="space-y-5">
                {/* Tip 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-1">Đảm bảo dự ảnh sáng đó AI nhận diện màu sắc thực phẩm tốt nhất.</p>
                    <p className="text-gray-600 text-sm"></p>
                  </div>
                </div>

                {/* Tip 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-1">Đặt thực phẩm ở giữa khung hình, tránh bị che khuất.</p>
                    <p className="text-gray-600 text-sm"></p>
                  </div>
                </div>

                {/* Tip 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-1">Dùng với bữa ăn nhiều mẽn, hãy quét từng món riêng biệt để chính xác hơn.</p>
                    <p className="text-gray-600 text-sm"></p>
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
