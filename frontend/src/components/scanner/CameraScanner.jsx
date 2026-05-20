import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { api } from "../../services/api";
import { Camera, Upload, RefreshCw, AlertTriangle, ShieldAlert } from "lucide-react";

export default function CameraScanner({ onScanSuccess }) {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment"); // "user" or "environment"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasCamera, setHasCamera] = useState(true);

  // Capture screenshot from webcam
  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;
    setError("");
    setLoading(true);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Không thể chụp ảnh từ Camera. Hãy thử tải ảnh lên.");
      }

      console.log("Image captured from camera. Analyzing...");
      const result = await api.scanFoodImage(imageSrc);
      
      if (result.success && result.analysis) {
        if (result.analysis.isFood === false) {
          setError(result.analysis.summary || "Ảnh không chứa thực phẩm có thể nhận diện.");
        } else {
          onScanSuccess(result.analysis);
        }
      } else {
        throw new Error("Kết quả trả về không hợp lệ.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Không thể phân tích ảnh.");
    } finally {
      setLoading(false);
    }
  }, [webcamRef, onScanSuccess]);

  // Handle manual file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setLoading(true);

    try {
      console.log("File uploaded: " + file.name + ". Analyzing...");
      const result = await api.scanFoodImage(file);
      
      if (result.success && result.analysis) {
        if (result.analysis.isFood === false) {
          setError(result.analysis.summary || "Ảnh không chứa thực phẩm có thể nhận diện.");
        } else {
          onScanSuccess(result.analysis);
        }
      } else {
        throw new Error("Kết quả trả về không hợp lệ.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Không thể phân tích ảnh.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle camera direction
  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
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
    <div className="w-full flex flex-col items-center gap-6">
      {/* Scanner Box */}
      <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
        {hasCamera ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleCameraError}
              className="w-full h-full object-cover"
            />
            {/* Camera Overlays */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-950/40"></div>
            
            {/* Square alignment bracket overlay */}
            <div className="absolute inset-12 border-2 border-emerald-500/30 rounded-xl pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-md"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-md"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-md"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-md"></div>
              
              {/* Sweeping Laser Line */}
              {!loading && (
                <div className="absolute left-0 right-0 h-0.5 bg-emerald-500/80 shadow-[0_0_12px_#10b981] animate-laser"></div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <AlertTriangle className="w-16 h-16 text-yellow-500/80 mb-4 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-slate-200 mb-2">Không truy cập được Camera</h3>
            <p className="text-sm max-w-xs">Hãy cấp quyền truy cập camera trong trình duyệt hoặc sử dụng tính năng tải ảnh từ thư viện bên dưới.</p>
          </div>
        )}

        {/* Scan/AI Loading state overlay */}
        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center z-20">
            <div className="relative flex items-center justify-center mb-6">
              {/* Spinning circular ring */}
              <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
              <Camera className="w-6 h-6 text-emerald-400 absolute" />
            </div>
            <p className="text-emerald-400 font-bold tracking-wide animate-pulse">
              ĐANG PHÂN TÍCH DINH DƯỠNG...
            </p>
            <p className="text-slate-400 text-xs mt-2">Gemini 1.5 Flash đang quét thực phẩm</p>
          </div>
        )}
      </div>

      {/* Show scanning errors */}
      {error && (
        <div className="w-full max-w-md p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="w-full max-w-md flex gap-4">
        {hasCamera && (
          <>
            <button
              onClick={handleCapture}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.99] text-slate-950 font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all text-sm disabled:opacity-50"
            >
              <Camera className="w-5 h-5 stroke-[2.5]" />
              Quét Ngay
            </button>
            
            <button
              onClick={toggleCamera}
              disabled={loading}
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-slate-100 p-4 rounded-xl active:scale-[0.99] transition-all"
              title="Đổi camera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </>
        )}

        <label className={`cursor-pointer bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-slate-100 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all text-sm active:scale-[0.99] ${!hasCamera ? 'w-full' : ''}`}>
          <Upload className="w-5 h-5" />
          <span>Tải Ảnh Lên</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={loading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
