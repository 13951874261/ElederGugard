import React, { useEffect } from 'react';
import { TriangleAlert, PhoneOff, ShieldBan, Phone } from 'lucide-react';
import { Button } from './ui/Button';

interface ScamAlertProps {
  reason: string;
  onDismiss: () => void;
}

export const ScamAlert: React.FC<ScamAlertProps> = ({ reason, onDismiss }) => {
  
  useEffect(() => {
    // Voice dissuasion logic
    const speak = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any previous speech
        const utterance = new SpeechSynthesisUtterance("警告！检测到诈骗风险！请挂断电话，拨打110核实！千万不要转账！");
        utterance.lang = 'zh-CN';
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    };

    speak();

    // Loop warning every 5 seconds if still active
    const interval = setInterval(speak, 5000);

    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-red-600 to-red-900 flex flex-col items-center justify-center p-6 animate-pulse text-white font-sans text-center">
      <div className="bg-white p-6 rounded-full mb-6 shadow-2xl animate-bounce">
        <TriangleAlert size={64} className="text-red-600" />
      </div>
      
      <h1 className="text-4xl font-serif font-bold mb-4 tracking-wider drop-shadow-lg">红色警报</h1>
      
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-3xl border border-white/10 mb-8 w-full max-w-sm">
        <p className="text-lg font-bold mb-2 text-red-100 flex items-center justify-center">
          <ShieldBan size={20} className="mr-2" />
          系统已强制阻断
        </p>
        <p className="text-base text-white font-medium leading-relaxed opacity-95">{reason}</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="text-2xl font-bold bg-white/10 px-6 py-2 rounded-lg border border-white/20">
           🚫 严禁转账
        </div>
        <div className="text-2xl font-bold bg-white/10 px-6 py-2 rounded-lg border border-white/20">
           👮 拨打 110
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button 
          variant="secondary" 
          onClick={onDismiss} 
          className="bg-white text-red-700 hover:bg-red-50 border-none font-bold text-xl py-5 shadow-2xl w-full rounded-2xl"
        >
          <div className="flex items-center justify-center space-x-3">
            <PhoneOff size={24} />
            <span>立即挂断</span>
          </div>
        </Button>
        
        <button 
          onClick={onDismiss} 
          className="w-full py-3 text-red-200 text-sm hover:text-white transition-colors underline-offset-4 opacity-70 hover:opacity-100"
        >
          误报，解除锁定
        </button>
      </div>
    </div>
  );
};