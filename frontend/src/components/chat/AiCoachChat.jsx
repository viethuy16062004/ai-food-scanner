import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { Send, MessageSquare, X } from "lucide-react";

export default function AiCoachChat({ isOpen, onClose, user, currentPage }) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    { sender: "ai", text: "Chào bạn! Mình là AI Coach. Mình có thể giúp gì cho chế độ dinh dưỡng và thực đơn hôm nay của bạn?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatLog, isOpen]);

  if (!isOpen) return null;

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || loading) return;

    const userText = chatMessage;
    const userMsg = { sender: "user", text: userText };
    setChatLog((prev) => [...prev, userMsg]);
    setChatMessage("");
    setLoading(true);

    try {
      const history = chatLog;
      const res = await api.chatWithCoach(userText, history);
      
      setChatLog((prev) => [...prev, { sender: "ai", text: res.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatLog((prev) => [
        ...prev,
        { sender: "ai", text: "Xin lỗi bạn, kết nối của mình gặp sự cố một chút. Bạn có câu hỏi nào khác không?" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed right-4 sm:right-8 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[70vh] sm:max-h-[500px] border border-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-200 ${
        currentPage === "home" ? "bottom-24" : "bottom-6"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#047857] to-[#065f46] text-white p-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-600 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm tracking-wide">AI Coach dinh dưỡng</h4>
            <p className="text-[10px] text-emerald-100/90 font-semibold">Đang trực tuyến • Hỗ trợ 24/7</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50">
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed font-semibold shadow-sm border ${
                msg.sender === "user"
                  ? "bg-[#047857] text-white border-emerald-600 rounded-tr-none"
                  : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white text-slate-400 border border-slate-100 rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          disabled={loading}
          placeholder="Nhập tin nhắn để được tư vấn dinh dưỡng..."
          className="flex-1 bg-slate-50 border border-slate-100 focus:border-emerald-300 outline-none text-xs font-semibold px-4 py-3 rounded-2xl disabled:opacity-75"
        />
        <button
          type="submit"
          disabled={!chatMessage.trim() || loading}
          className="bg-[#047857] hover:bg-[#065f46] disabled:bg-slate-200 disabled:text-slate-400 text-white px-4 py-3 rounded-2xl transition-all shadow-sm flex items-center justify-center shrink-0 active:scale-[0.97]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
