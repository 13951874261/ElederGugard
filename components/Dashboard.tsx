import React from 'react';
import { Shield, ScanLine, FileText, User, ChevronRight, Clock, Diamond, Activity } from 'lucide-react';
import { UserState, AppView } from '../types';

interface DashboardProps {
  userState: UserState;
  setView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userState, setView }) => {
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-[#fafaf9] overflow-y-auto relative">
      
      {/* Non-VIP Session Timer Banner - Light Luxury Style (Red Alert) */}
      {!userState.isVip && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 text-red-800 px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm border-b border-red-200 backdrop-blur-md bg-opacity-95">
          <div className="flex items-center space-x-2">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
             <span className="text-xs font-bold tracking-wide">试用倒计时</span>
          </div>
          <div className="font-mono font-bold text-red-700 flex items-center text-sm">
            <Clock size={14} className="mr-1.5" />
            {formatTime(userState.sessionTimeLeft)}
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`p-8 bg-gradient-to-b from-white to-[#f5f5f4] rounded-b-[3rem] shadow-xl shadow-stone-200/40 border-b border-white ${!userState.isVip ? 'pt-6' : ''}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-800 mb-1 tracking-tight">孝心守护·全能盾</h1>
            <p className="text-[10px] text-stone-400 font-serif tracking-widest uppercase mb-3">Sovereign Guardian v2.0</p>
            <div className="flex items-center space-x-2">
              {userState.isVip ? (
                 <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-400 text-white text-[10px] font-bold tracking-widest shadow-md flex items-center">
                    <Diamond size={10} className="mr-1 fill-current" />
                    至尊版 VIP
                 </span>
              ) : (
                 <span className="px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-500 text-[10px] font-bold tracking-wider shadow-sm">
                    剩余试用: {userState.trialsLeft}次
                 </span>
              )}
            </div>
            <p className="text-stone-300 text-[10px] font-mono mt-2 ml-1">ID: {userState.machineId.substring(0, 8)}...</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-stone-100 shadow-lg shadow-stone-200/50">
            <User size={22} className="text-stone-400" />
          </div>
        </div>

        {/* Status Card - Dual Core Operation */}
        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100/50 rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-emerald-900/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <p className="text-emerald-700 text-[10px] font-bold mb-2 flex items-center uppercase tracking-widest">
              <Shield size={10} className="mr-1" /> Dual-Core Defense
            </p>
            <h2 className="text-2xl font-serif font-bold text-stone-800 tracking-tight">双核并行守护</h2>
            <p className="text-stone-500 text-xs mt-2 font-medium">
              已拦截 <span className="font-bold text-emerald-600 text-lg mx-0.5 font-serif">{userState.scamStats.blockedCount}</span> 次风险
            </p>
          </div>
          <div className="relative z-10 h-16 w-16 rounded-full bg-white/80 border-[3px] border-emerald-50 flex items-center justify-center shadow-lg backdrop-blur-sm">
            <div className="absolute inset-1 rounded-full border-t-[3px] border-emerald-500 animate-spin"></div>
            <span className="text-[10px] font-bold text-emerald-600">ON</span>
          </div>
        </div>
        
        {/* Slogan - Full PRD Version */}
        <div className="mt-6 px-4">
            <p className="text-xs text-stone-400 font-serif italic text-center leading-relaxed opacity-90 border-t border-stone-200/50 pt-4">
            “别让‘高回报’变成倾家荡产，<br/>别让‘隐形扣费’掏空养老金<br/>——AI全能守护，一台手机，双重防线。”
            </p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="flex-1 px-6 py-6 space-y-4">
        <h3 className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] pl-2 mb-1">核心防护 / Core Protection</h3>
        
        {/* Radar Card */}
        <div 
          onClick={() => setView(AppView.RADAR)}
          className="group relative bg-white border border-stone-100 rounded-3xl p-5 hover:shadow-xl hover:shadow-red-900/5 hover:border-red-100 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:-translate-y-1"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 transition-opacity group-hover:opacity-80"></div>
          <div className="relative z-10 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 text-red-500 flex items-center justify-center mr-4 shadow-inner">
              <Activity size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-serif font-bold text-stone-800 mb-0.5">骗局雷达</h4>
              <p className="text-[10px] text-stone-500 font-medium">被动防御 · 实时语音/短信阻断</p>
            </div>
            <ChevronRight size={18} className="text-stone-300 group-hover:text-red-400 transition-colors" />
          </div>
        </div>

        {/* Cleaner Card */}
        <div 
          onClick={() => setView(AppView.CLEANER)}
          className="group relative bg-white border border-stone-100 rounded-3xl p-5 hover:shadow-xl hover:shadow-amber-900/5 hover:border-amber-100 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:-translate-y-1"
        >
           <div className="absolute right-0 top-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 transition-opacity group-hover:opacity-80"></div>
          <div className="relative z-10 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-500 flex items-center justify-center mr-4 shadow-inner">
              <ScanLine size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-serif font-bold text-stone-800 mb-0.5">孝心清道夫</h4>
              <p className="text-[10px] text-stone-500 font-medium">主动治理 · 模拟点击清理流氓软件</p>
            </div>
            <ChevronRight size={18} className="text-stone-300 group-hover:text-amber-400 transition-colors" />
          </div>
        </div>

        {/* Report Card */}
        <div 
          onClick={() => setView(AppView.REPORT)}
          className="group relative bg-white border border-stone-100 rounded-3xl p-5 hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:-translate-y-1"
        >
           <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60 transition-opacity group-hover:opacity-80"></div>
          <div className="relative z-10 flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-500 flex items-center justify-center mr-4 shadow-inner">
              <FileText size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-serif font-bold text-stone-800 mb-0.5">孝心周报</h4>
              <p className="text-[10px] text-stone-500 font-medium">生成本周守护报告</p>
            </div>
            <ChevronRight size={18} className="text-stone-300 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};