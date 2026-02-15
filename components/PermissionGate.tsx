import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Settings, Hand, Layers, CheckCircle } from 'lucide-react';

interface PermissionGateProps {
  onComplete: () => void;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Poll for permission changes when app is active
  React.useEffect(() => {
    let intervalId: number;

    const checkStatus = () => {
      if (window.Android) {
        if (step === 1 && window.Android.isAccessibilityEnabled && window.Android.isAccessibilityEnabled()) {
          setStep(2);
        }
        // Note: Overlay permission check is harder to do synchronously without reloading on some Android versions.
        // But we can check it if we had a native method. For now, Step 1 automation is the big win.
      }
    };

    // Check immediately and then poll every 1s
    checkStatus();
    intervalId = window.setInterval(checkStatus, 1000);

    return () => clearInterval(intervalId);
  }, [step]);

  const handleGrant = () => {
    setIsProcessing(true);

    // Call Native Interface
    if (window.Android) {
      if (step === 1) {
        if (window.Android.openAccessibilitySettings) {
          window.Android.openAccessibilitySettings();
        }
      } else {
        if (window.Android.openOverlaySettings) {
          window.Android.openOverlaySettings();
        }
      }
    }

    // Fallback: If polling doesn't work (e.g. Android kills BG JS), 
    // allow manual continuation after delay
    setTimeout(() => {
      setIsProcessing(false);
      // We rely on the polling to advance Step 1 -> 2 usually.
      // But for Step 2, or if polling fails, we allow user to click "Done" manually if we add a "I've enabled it" button,
      // OR we just assume success after a long delay for MVP.
      if (step === 2) {
        onComplete();
      }
    }, 3000);
  };

  return (
    <div className="h-full p-6 flex flex-col justify-center bg-[#fafaf9]">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center border border-stone-200 shadow-xl shadow-stone-200/50">
          {step === 1 ? (
            <Hand className="text-amber-500" size={48} />
          ) : (
            <Layers className="text-blue-500" size={48} />
          )}
        </div>

        <h2 className="text-2xl font-bold text-stone-800 font-serif">
          {step === 1 ? '步骤 1/2: 开启无障碍服务' : '步骤 2/2: 开启悬浮窗权限'}
        </h2>

        <p className="text-stone-500 leading-relaxed max-w-xs">
          {step === 1
            ? '为了自动拦截诈骗电话和帮助父母自动清理垃圾，我们需要获取“无障碍”权限。'
            : '为了在检测到诈骗时立即全屏弹窗警告，我们需要“悬浮窗”权限。'}
        </p>

        {/* Mock System Settings Preview */}
        <div className="w-full max-w-xs bg-white rounded-xl p-5 border border-stone-200 text-left text-sm text-stone-600 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-3 mb-3">
            <Settings size={16} className="text-stone-400" />
            <span className="font-medium text-stone-500">系统设置 &gt; {step === 1 ? '无障碍' : '应用管理'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-stone-800">孝心守护</span>
            <div className="flex items-center text-amber-600 font-bold text-xs">
              去开启 <div className="ml-2 w-8 h-4 bg-stone-200 rounded-full relative"><div className="absolute right-0 w-4 h-4 bg-white rounded-full border border-stone-300 shadow-sm"></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 w-full">
        <Button onClick={handleGrant} fullWidth disabled={isProcessing}>
          {isProcessing ? '正在跳转设置...' : '去授权'}
        </Button>
        {step === 1 && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-stone-400 text-xs">
            <CheckCircle size={14} className="text-emerald-500" />
            <span>国家级安全认证，隐私加密</span>
          </div>
        )}
      </div>
    </div>
  );
};