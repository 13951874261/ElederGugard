import React from 'react';
import { ArrowLeft, Share2, TrendingUp, Shield, Activity } from 'lucide-react';
import { Button } from './ui/Button';

interface ReportProps {
  onBack: () => void;
  stats: {
    blocked: number;
    cleaned: number;
  };
}

export const Report: React.FC<ReportProps> = ({ onBack, stats }) => {
  return (
    <div className="h-full flex flex-col bg-[#fafaf9] overflow-y-auto">
      <div className="p-4 flex items-center border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-stone-500 hover:text-stone-800 transition-colors">
          <ArrowLeft />
        </button>
        <h2 className="ml-2 text-lg font-bold text-stone-800 font-serif">孝心守护周报</h2>
      </div>

      <div className="p-6">
        {/* Paper Effect */}
        <div className="bg-white text-stone-800 rounded-lg p-6 shadow-xl shadow-stone-200/50 relative overflow-hidden border border-stone-100">
          {/* Header Pattern */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>

          <div className="text-center border-b-2 border-stone-100 pb-6 mb-6 mt-2">
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">守护周报</h1>
            <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">尊享版安全简报</p>
            <p className="text-xs font-mono text-stone-400 mt-2 bg-stone-50 inline-block px-3 py-1 rounded">{new Date().toLocaleDateString()} 生成</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-wide mb-1">本周拦截风险</p>
                <p className="text-4xl font-serif font-bold text-stone-800">{stats.blocked} <span className="text-sm text-stone-400 font-sans font-normal">次</span></p>
              </div>
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
                <Shield className="text-red-500" size={28} />
              </div>
            </div>

            <div className="flex items-center justify-between p-2">
              <div>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-wide mb-1">清理垃圾/隐患</p>
                <p className="text-4xl font-serif font-bold text-stone-800">{stats.cleaned} <span className="text-sm text-stone-400 font-sans font-normal">MB</span></p>
              </div>
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                <Activity className="text-amber-500" size={28} />
              </div>
            </div>

            <div className="bg-stone-50 p-5 rounded-xl border border-stone-100 mt-4">
              <div className="flex items-center mb-3">
                <TrendingUp size={18} className="text-emerald-600 mr-2" />
                <span className="font-bold text-stone-700 font-serif">健康评分: 98</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[98%] shadow-sm"></div>
              </div>
              <p className="text-xs text-stone-500 mt-3 leading-relaxed">父母手机运行环境非常安全，未发现高危应用残留。</p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-100 text-center">
            <p className="text-lg italic text-stone-600 font-serif">"陪伴是最长情的告白，<br />守护是最坚实的后盾。"</p>
            <div className="mt-6 flex justify-center">
              <div className="w-20 h-20 bg-white border border-stone-200 p-1 shadow-sm">
                <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-stone-200 text-center leading-tight">扫描<br />查阅</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 mt-2">子女扫码查看详细报告</p>
          </div>
        </div>

        <div className="mt-8 mb-4">
          <Button
            fullWidth
            variant="primary"
            className="flex items-center justify-center shadow-lg shadow-amber-900/10"
            onClick={() => {
              const reportText = `【孝心守护周报】\n📅 生成日期: ${new Date().toLocaleDateString()}\n🛡️ 拦截风险: ${stats.blocked} 次\n🧹 清理隐患: ${stats.cleaned} MB\n✅ 父母手机目前安全状况良好。\n\n-- 来自“孝心守护·全能盾”`;
              if (window.Android && window.Android.shareText) {
                window.Android.shareText(reportText);
              } else {
                console.log("Mock Share:", reportText);
                // Fallback for browser testing
                alert("调用系统分享:\n" + reportText);
              }
            }}
          >
            <Share2 size={18} className="mr-2" /> 发送给子女
          </Button>
        </div>
      </div>
    </div>
  );
};