import React, { useState, useEffect, useRef } from 'react';
import { AppView, UserState } from './types';
import { Paywall } from './components/Paywall';
import { PermissionGate } from './components/PermissionGate';
import { Dashboard } from './components/Dashboard';
import { Radar } from './components/Radar';
import { ScamAlert } from './components/ScamAlert';
import { Cleaner } from './components/Cleaner';
import { Report } from './components/Report';
import { getMachineId, getLicenseStatus, decrementTrial } from './services/licenseService';

// PRD: Session Fuse set to 180 seconds (3 minutes) for non-VIP
const SESSION_LIMIT_SECONDS = 180;

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.BOOT);
  const [scamAlert, setScamAlert] = useState<string | null>(null);

  const [userState, setUserState] = useState<UserState>({
    machineId: '',
    isVip: false,
    trialsLeft: 0,
    sessionTimeLeft: SESSION_LIMIT_SECONDS,
    permissions: { accessibility: false, overlay: false },
    scamStats: { scannedCount: 120, blockedCount: 3 },
    cleanStats: { lastCleanDate: null, trashCleanedMb: 0 }
  });

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. Startup & Auth Flow
    const initApp = async () => {
      const machineId = getMachineId();
      // Bmob is async
      const { isVip, trialsLeft } = await getLicenseStatus();

      let currentTrials = trialsLeft;

      // If not VIP, consume a trial on startup (Launch Counter Logic)
      if (!isVip) {
        if (trialsLeft > 0) {
          // Decrement is now async too
          currentTrials = await decrementTrial();
        } else {
          // No trials left, force Paywall immediately
          setUserState(prev => ({ ...prev, machineId, isVip, trialsLeft: 0 }));
          setView(AppView.PAYWALL);
          return;
        }
      }

      setUserState(prev => ({
        ...prev,
        machineId,
        isVip,
        trialsLeft: currentTrials
      }));

      // Delay for boot animation
      setTimeout(() => {
        // Double check state before transition
        if (!isVip && currentTrials < 0) {
          setView(AppView.PAYWALL);
        } else {
          // Guide to permissions if allowed
          setView(AppView.PERMISSIONS);
        }
      }, 1500);
    };

    // Push initial keywords to Native Layer
    if (window.Android && window.Android.updateScamKeywords) {
      const defaultKeywords = JSON.stringify(["转账", "安全账户", "投资", "回报率", "冻结", "百万保障"]);
      window.Android.updateScamKeywords(defaultKeywords);
    }

    initApp();
  }, []);

  // 2. Session Timer (The Fuse)
  useEffect(() => {
    if (userState.isVip) return; // VIPs have no limit
    if (view === AppView.PAYWALL || view === AppView.BOOT) return; // Don't count down on paywall/boot

    timerRef.current = window.setInterval(() => {
      setUserState(prev => {
        const newTime = prev.sessionTimeLeft - 1;
        if (newTime <= 0) {
          clearInterval(timerRef.current!);
          // FUSE BLOWN - Forced Paywall
          setView(AppView.PAYWALL);
          return { ...prev, sessionTimeLeft: 0 };
        }
        return { ...prev, sessionTimeLeft: newTime };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, userState.isVip]);

  const handleActivateVip = () => {
    // const { isVip } = getLicenseStatus(); // Removed: getLicenseStatus is async and unnecessary here
    setUserState(prev => ({ ...prev, isVip: true }));
    // Reset session constraints and go to Dashboard
    setView(AppView.DASHBOARD);
  };

  const handlePermissionsGranted = () => {
    setUserState(prev => ({
      ...prev,
      permissions: { accessibility: true, overlay: true }
    }));
    setView(AppView.DASHBOARD);
  };

  const handleScamDetected = (reason: string) => {
    setUserState(prev => ({
      ...prev,
      scamStats: {
        ...prev.scamStats,
        blockedCount: prev.scamStats.blockedCount + 1
      }
    }));
    setScamAlert(reason);
  };

  const handleCleanStatsUpdate = (mb: number) => {
    setUserState(prev => ({
      ...prev,
      cleanStats: {
        lastCleanDate: new Date().toISOString(),
        trashCleanedMb: prev.cleanStats.trashCleanedMb + mb
      }
    }));
  };

  // Render Content based on View
  const renderContent = () => {
    switch (view) {
      case AppView.BOOT:
        return (
          <div className="h-full flex flex-col items-center justify-center bg-[#fafaf9] space-y-4">
            <div className="w-20 h-20 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
            <p className="text-stone-400 font-serif font-bold tracking-widest text-xs uppercase animate-pulse">系统初始化中...</p>
          </div>
        );
      case AppView.PAYWALL:
        return <Paywall machineId={userState.machineId} onActivate={handleActivateVip} />;
      case AppView.PERMISSIONS:
        return <PermissionGate onComplete={handlePermissionsGranted} />;
      case AppView.DASHBOARD:
        return <Dashboard userState={userState} setView={setView} />;
      case AppView.RADAR:
        return <Radar onBack={() => setView(AppView.DASHBOARD)} onScamDetected={handleScamDetected} />;
      case AppView.CLEANER:
        return <Cleaner onBack={() => setView(AppView.DASHBOARD)} updateStats={handleCleanStatsUpdate} />;
      case AppView.REPORT:
        return <Report onBack={() => setView(AppView.DASHBOARD)} stats={{ blocked: userState.scamStats.blockedCount, cleaned: userState.cleanStats.trashCleanedMb }} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900">
      {renderContent()}

      {/* Global Alert Overlay - Always on top */}
      {scamAlert && (
        <ScamAlert reason={scamAlert} onDismiss={() => setScamAlert(null)} />
      )}
    </div>
  );
};

export default App;