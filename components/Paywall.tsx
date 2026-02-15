import React, { useState } from 'react';
import { Button } from './ui/Button';
import { ShieldCheck, Star, Crown, Lock, KeyRound, Copy, AlertTriangle } from 'lucide-react';
import { activateLicense } from '../services/licenseService';

interface PaywallProps {
  onActivate: () => void;
  machineId: string;
}

export const Paywall: React.FC<PaywallProps> = ({ onActivate, machineId }) => {
  const [activationCode, setActivationCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const handleActivation = async () => {
    setIsActivating(true);
    setErrorMsg('');
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const success = await activateLicense(activationCode, machineId);
    if (success) {
      onActivate();
    } else {
      setErrorMsg('激活码无效，请检查后重试');
      setIsActivating(false);
    }
  };

  const copyMachineId = () => {
    navigator.clipboard.writeText(machineId);
  };

  return (
    <div className="h-full flex flex-col items-center justify-between p-8 bg-[#0F0F0F] text-center relative overflow-hidden z-50">
      {/* PRD 5.1: Visual - Deep matte background + Red breathing light */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1919] via-[#0F0F0F] to-[#000000] z-0"></div>
      
      {/* Red Breathing Light / Warning Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[50%] bg-red-900/10 rounded-full blur-[80px] animate-pulse z-0 pointer-events-none"></div>

      <div className="mt-6 flex flex-col items-center w-full z-10 relative">
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2a2928] to-[#1c1917] flex items-center justify-center shadow-2xl shadow-black border border-amber-500/30 relative z-10">
            <Lock size={40} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
          </div>
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-400 animate-bounce">
            STOP
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-amber-500 mb-2 tracking-tight drop-shadow-md">服务已熔断</h1>
        <p className="text-stone-600 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border-b border-stone-800 pb-2">Sovereign Obsidian Paywall</p>
        
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 mb-6 w-full backdrop-blur-sm">
           <div className="flex items-center justify-center text-red-500 mb-1">
             <AlertTriangle size={16} className="mr-2" />
             <span className="text-xs font-bold">试用次数/时长已耗尽</span>
           </div>
           <p className="text-stone-400 text-xs leading-relaxed opacity-80">
             您的设备 <span className="text-stone-300 font-mono">{machineId.substring(0,6)}...</span> 已失去保护。<br/>
             请立即激活以恢复 <span className="text-amber-500">双核防御</span>。
           </p>
        </div>
        
        {/* Machine ID Section - Dark Theme */}
        <div className="w-full bg-[#1c1917]/80 backdrop-blur-md border border-stone-800 rounded-xl p-4 mb-6 flex items-center justify-between shadow-lg">
          <div className="text-left overflow-hidden mr-2">
             <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">设备识别码 / Machine ID</p>
             <p className="text-stone-300 font-mono text-[10px] truncate font-bold mt-1 select-all tracking-wider">{machineId}</p>
          </div>
          <button onClick={copyMachineId} className="p-2 bg-stone-800 rounded-lg hover:bg-stone-700 transition-colors text-amber-500 border border-stone-700 shrink-0">
            <Copy size={16} />
          </button>
        </div>

        {/* Features List - Dark Theme */}
        <div className="w-full space-y-3 pl-2 opacity-80">
          <div className="flex items-center space-x-3 text-left">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span className="text-stone-400 text-xs font-medium">骗局雷达：实时阻断诈骗通话</span>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <Star size={16} className="text-amber-500 shrink-0" />
            <span className="text-stone-400 text-xs font-medium">孝心清道夫：自动治理流氓软件</span>
          </div>
          <div className="flex items-center space-x-3 text-left">
            <Crown size={16} className="text-purple-500 shrink-0" />
            <span className="text-stone-400 text-xs font-medium">单机单授权，终身至尊守护</span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-4 pb-4 z-10">
        <div className="space-y-2">
            <label className="text-left text-xs font-bold text-stone-500 block ml-1 uppercase tracking-wide">激活凭证 (Activation Key)</label>
            <div className="relative group">
                <input 
                  type="text" 
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  placeholder="在此输入激活码"
                  className="w-full p-4 pl-10 bg-[#1c1917] border border-stone-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-mono text-amber-500 shadow-inner uppercase transition-all placeholder:text-stone-700 font-bold"
                />
                <KeyRound size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-600 group-focus-within:text-amber-500 transition-colors" />
            </div>
            {errorMsg && <p className="text-red-500 text-xs text-left ml-1 font-bold animate-pulse flex items-center"><AlertTriangle size={10} className="mr-1"/>{errorMsg}</p>}
        </div>

        <Button 
          onClick={handleActivation} 
          fullWidth 
          disabled={isActivating || !activationCode} 
          className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white border-none shadow-[0_0_20px_rgba(245,158,11,0.2)] py-4 text-lg font-serif tracking-widest"
        >
          {isActivating ? '正在联网验证...' : '立即激活保护'}
        </Button>
        <p className="text-[10px] text-stone-600">联系子女获取激活码 (Universal Key: VIP888)</p>
      </div>
    </div>
  );
};