export enum AppView {
  BOOT = 'BOOT',
  PAYWALL = 'PAYWALL',
  PERMISSIONS = 'PERMISSIONS',
  DASHBOARD = 'DASHBOARD',
  RADAR = 'RADAR',
  CLEANER = 'CLEANER',
  REPORT = 'REPORT',
}

export interface UserState {
  machineId: string;
  isVip: boolean;
  trialsLeft: number;
  sessionTimeLeft: number; // Seconds remaining in current session
  permissions: {
    accessibility: boolean;
    overlay: boolean;
  };
  scamStats: {
    scannedCount: number;
    blockedCount: number;
  };
  cleanStats: {
    lastCleanDate: string | null;
    trashCleanedMb: number;
  };
}

export interface ScamAnalysisResult {
  isScam: boolean;
  riskLevel: 'safe' | 'low' | 'medium' | 'high';
  reason: string;
  category: string;
}

export type AppState = {
  view: AppView;
  userState: UserState;
}

declare global {
  interface Window {
    Android?: {
      getMachineId: () => string;
      isAccessibilityEnabled: () => boolean;
      openAccessibilitySettings: () => void;
      openOverlaySettings: () => void;
      updateScamKeywords: (json: string) => void;
      requestUninstallApp: (pkg: string) => void;
      getInstalledApps: () => string;
      getInterceptionHistory: () => string;
      shareText: (text: string) => void;
    };
  }
}

export interface WeeklyReportData {
  startDate: string;
  endDate: string;
  interceptedCalls: number;
  interceptedMsgs: number;
  cleanedJunkMb: number;
  healthScore: number;
}