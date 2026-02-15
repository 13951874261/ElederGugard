import React, { useState } from 'react';
import { ArrowLeft, MessageSquareWarning, ShieldCheck, Loader2, Send, Mic } from 'lucide-react';
import { Button } from './ui/Button';
import { analyzeTextForScam } from '../services/geminiService';
import { AppView } from '../types';

interface RadarProps {
  onBack: () => void;
  onScamDetected: (reason: string) => void;
}

export const Radar: React.FC<RadarProps> = ({ onBack, onScamDetected }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<{ text: string, isScam: boolean, reason: string }[]>([]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    const result = await analyzeTextForScam(inputText);
    setIsAnalyzing(false);

    if (result.isScam && result.riskLevel !== 'safe') {
      onScamDetected(`${result.reason} (类型: ${result.category})`);
    }

    setHistory(prev => [{
      text: inputText,
      isScam: result.isScam,
      reason: result.reason,
      timestamp: Date.now()
    }, ...prev]);

    setInputText('');
  };

  // Poll for native interception logs
  React.useEffect(() => {
    const fetchLogs = () => {
      if (window.Android && window.Android.getInterceptionHistory) {
        try {
          const json = window.Android.getInterceptionHistory();
          const nativeLogs = JSON.parse(json);
          // Convert native logs to UI format
          const formattedLogs = nativeLogs.reverse().map((log: any) => ({
            text: "系统自动拦截：疑似诈骗内容",
            isScam: true,
            reason: "触发关键词阻断",
            timestamp: log.time
          }));

          // Merge? For now just show native logs + local manual checks
          // Ideally we should merge, but since native logs persist, let's prepend them
          // or just set them if we want a "Live" view.
          // Simplified: Just append local history to native history
          // setHistory(prev => [...formattedLogs, ...prev.filter(i => !i.timestamp)]); 
          // Better: just fetch once or poll? Polling is safer for "Realtime" feel

          // We use a ref or just simple SetState to avoid infinite loops if we were merging carefully.
          // For MVP, let's just show Native Logs mostly.
          setHistory(prev => {
            // Avoid duplicates if possible, or just overwrite for "Refresh"
            // Let's keep manual inputs (which have 'text' that isn't generic)
            const manual = prev.filter(p => p.text !== "系统自动拦截：疑似诈骗内容");
            return [...formattedLogs, ...manual];
          });
        } catch (e) { console.error(e); }
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#fafaf9]">
      <div className="p-4 pt-6 flex items-center border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-stone-500 hover:text-stone-800 transition-colors rounded-full hover:bg-stone-100">
          <ArrowLeft size={20} />
        </button>
        <h2 className="ml-2 text-xl font-bold text-stone-800 font-serif">骗局雷达</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-lg shadow-stone-200/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-stone-800 font-serif">实时防护状态</span>
            <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-700">监听中</span>
            </div>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed font-medium">
            后台静默运行中，系统正在自动扫描短信、微信及通话语音。您也可以在此处手动输入文本进行模拟检测。
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider ml-1">手动检测 / Manual Check</label>
          <div className="relative shadow-md shadow-stone-200/50 rounded-2xl bg-white transition-all focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:shadow-xl">
            <textarea
              className="w-full h-36 bg-transparent rounded-2xl p-5 text-stone-800 placeholder-stone-300 focus:outline-none text-base resize-none font-medium"
              placeholder="在此粘贴可疑信息，例如：'爸，我换号了，急需用钱...' 或 '恭喜您中奖...'"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <button className="p-2 text-stone-300 hover:text-stone-500 transition-colors">
                <Mic size={20} />
              </button>
              <Button
                variant="primary"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="py-2 px-4 h-10 w-10 !p-0 flex items-center justify-center rounded-xl shadow-amber-500/20"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              </Button>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="mt-8">
          <h3 className="text-xs font-bold text-stone-400 mb-4 uppercase tracking-wider ml-1">检测记录</h3>
          <div className="space-y-4">
            {history.length === 0 && (
              <div className="text-center py-10 opacity-50">
                <ShieldCheck size={48} className="mx-auto text-stone-200 mb-2" />
                <p className="text-stone-400 text-sm font-medium">暂无检测记录</p>
              </div>
            )}
            {history.map((item, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border transition-all ${item.isScam ? 'bg-white border-red-100 shadow-red-100/50' : 'bg-white border-emerald-100 shadow-emerald-100/50'} shadow-sm`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {item.isScam ? <MessageSquareWarning size={18} className="text-red-500" /> : <ShieldCheck size={18} className="text-emerald-500" />}
                    <span className={`text-xs font-bold ${item.isScam ? 'text-red-600' : 'text-emerald-600'}`}>
                      {item.isScam ? '高危信息' : '安全信息'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-300 font-mono">JUST NOW</span>
                </div>
                <p className="text-stone-700 text-sm mb-3 font-medium leading-relaxed">"{item.text}"</p>
                <div className={`text-xs p-3 rounded-lg ${item.isScam ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'} font-medium`}>
                  AI分析: {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};