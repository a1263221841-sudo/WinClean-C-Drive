export type SafetyLevel = 'safe' | 'recommended' | 'advanced' | 'caution';

export type CategoryGroup = 
  | 'temp_cache' 
  | 'windows_system' 
  | 'user_appdata' 
  | 'gaming_browsers' 
  | 'developer' 
  | 'advanced_system';

export interface CleanupItem {
  id: string;
  name: string;
  category: CategoryGroup;
  categoryLabel: string;
  description: string;
  detailedPath: string[];
  typicalSizeMinMB: number;
  typicalSizeMaxMB: number;
  safety: SafetyLevel;
  safetyLabel: string;
  whyClean: string;
  riskNote?: string;
  powershellCmd: string;
  batchCmd: string;
  manualStep: string;
  isDefaultSelected: boolean;
  windows11Support: boolean;
  windows10Support: boolean;
}

export interface DriveConfig {
  totalGB: number;
  usedGB: number;
  isSSD: boolean;
  driveLetter: string;
}

export interface DiagnosisAnswer {
  driveSize: number;
  freeSpaceAlert: 'critical' | 'low' | 'moderate' | 'healthy';
  isGamer: boolean;
  isDeveloper: boolean;
  useHibernation: boolean;
  recentWindowsUpgrade: boolean;
}
