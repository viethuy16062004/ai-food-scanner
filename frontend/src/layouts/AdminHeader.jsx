import React from "react";
import { LogOut, Shield, User } from "lucide-react";

export default function AdminHeader({ user, onLogout }) {
  return (
    <header className="bg-slate-900 sticky top-0 z-40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 shadow-md shadow-amber-500/10">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
              AI NUTRISCAN ADMIN
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-2 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 py-0.5 px-1.5 rounded-full font-bold uppercase">
              Quản trị
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 py-1.5 px-3 rounded-xl">
            <User className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">{user?.fullName || user?.username}</span>
          </div>

          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2.5 rounded-xl border border-transparent hover:border-red-500/10 transition-all active:scale-[0.97]"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
