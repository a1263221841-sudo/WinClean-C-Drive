import React, { useState } from 'react';
import { HardDrive, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Shield, Zap, Flame, Terminal, Sliders } from 'lucide-react';
import { CLEANUP_PRESETS } from '../data/cleanupCategories';

interface DriveVisualizerProps {
  totalDriveGB: number;
  setTotalDriveGB: (gb: number) => void;
  usedDriveGB: number;
  setUsedDriveGB: (gb: number) => void;
  isSSD: boolean;
  setIsSSD: (isSSD: boolean) => void;
  estimatedReclaimMinGB: number;
  estimatedReclaimMaxGB: number;
  activePreset: string | null;
  onApplyPreset: (presetId: string) => void;
}

export const DriveVisualizer: React.FC<DriveVisualizerProps> = ({
  totalDriveGB,
  setTotalDriveGB,
  usedDriveGB,
  setUsedDriveGB,
  isSSD,
  setIsSSD,
  estimatedReclaimMinGB,
  estimatedReclaimMaxGB,
  activePreset,
  onApplyPreset,
}) => {
  const [isEditingDrive, setIsEditingDrive] = useState(false);

  const freeDriveGB = Math.max(0, totalDriveGB - usedDriveGB);
  const usedPercent = Math.min(100, Math.round((usedDriveGB / totalDriveGB) * 100));
  
  // After clean calculations
  const avgReclaim = (estimatedReclaimMinGB + estimatedReclaimMaxGB) / 2;
  const simulatedAfterUsedGB = Math.max(20, usedDriveGB - avgReclaim);
  const simulatedAfterFreeGB = totalDriveGB - simulatedAfterUsedGB;
  const simulatedAfterPercent = Math.round((simulatedAfterUsedGB / totalDriveGB) * 100);

  // Status assessment
  const freePercent = 100 - usedPercent;
  let statusBg = 'bg-[#F0F1EB]';
  let statusBorder = 'border-[#D4D8C8]';
  let statusText = 'Optimal drive capacity';
  let statusTextColor = 'text-[#556345]';
  let isCritical = false;

  if (freePercent <= 10 || freeDriveGB < 15) {
    statusBg = 'bg-[#FBEBE6]';
    statusBorder = 'border-[#E8C5B8]';
    statusText = 'Critical: Windows low space alert! Clean recommended.';
    statusTextColor = 'text-[#B85338]';
    isCritical = true;
  } else if (freePercent <= 20 || freeDriveGB < 30) {
    statusBg = 'bg-[#FDF6E8]';
    statusBorder = 'border-[#ECD8AF]';
    statusText = 'Low Space: Temporary caches are accumulating.';
    statusTextColor = 'text-[#A07025]';
  }

  const presetIcons: Record<string, React.ReactNode> = {
    ShieldCheck: <Shield className="w-4 h-4 text-[#7D8F69]" />,
    Zap: <Zap className="w-4 h-4 text-[#688574]" />,
    Flame: <Flame className="w-4 h-4 text-[#C47D5C]" />,
    Terminal: <Terminal className="w-4 h-4 text-[#7A7D70]" />,
  };

  return (
    <div className="bg-white border border-[#E8EAE0] rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(61,64,53,0.04)] mb-8 transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Drive Info & Organic Status Visualizer */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className={`p-3 rounded-2xl border ${isCritical ? 'bg-[#FBEBE6] border-[#E8C5B8] text-[#B85338]' : 'bg-[#F0F1EB] border-[#E8EAE0] text-[#556345]'}`}>
                <HardDrive className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#2C2E25] flex items-center gap-2">
                    Local Disk (C:)
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0F1EB] text-[#7A7D70] border border-[#E8EAE0]">
                      NTFS
                    </span>
                  </h2>
                  <button
                    onClick={() => setIsEditingDrive(!isEditingDrive)}
                    className="text-xs text-[#7D8F69] hover:text-[#556345] font-semibold underline underline-offset-4 ml-1 flex items-center gap-1"
                  >
                    <Sliders className="w-3 h-3" />
                    {isEditingDrive ? 'Save' : 'Adjust'}
                  </button>
                </div>
                <p className="text-xs text-[#7A7D70] mt-0.5">
                  <strong className="text-[#2C2E25] font-bold">{freeDriveGB.toFixed(1)} GB</strong> free of {totalDriveGB} GB ({usedPercent}% used)
                </p>
              </div>
            </div>

            {/* SSD / HDD Toggle */}
            <button
              onClick={() => setIsSSD(!isSSD)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition ${
                isSSD
                  ? 'bg-[#E8EAE0] border-[#D4D8C8] text-[#3D4035]'
                  : 'bg-[#F8F9F5] border-[#E8EAE0] text-[#7A7D70]'
              }`}
              title="Click to toggle SSD or HDD drive type"
            >
              {isSSD ? '⚡ NVMe / SSD' : '💿 HDD Drive'}
            </button>
          </div>

          {/* Capacity Configuration Drawer */}
          {isEditingDrive && (
            <div className="p-4 bg-[#F8F9F5] rounded-2xl border border-[#E8EAE0] space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#7A7D70] font-semibold">Standard Disk Sizes:</span>
                {[128, 256, 512, 1000, 2000].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setTotalDriveGB(size);
                      setUsedDriveGB(Math.round(size * 0.82));
                    }}
                    className={`px-3 py-1 rounded-xl border text-xs font-semibold transition ${
                      totalDriveGB === size
                        ? 'bg-[#7D8F69] text-white border-[#7D8F69] shadow-sm'
                        : 'bg-white text-[#3D4035] border-[#E8EAE0] hover:bg-[#F0F1EB]'
                    }`}
                  >
                    {size >= 1000 ? `${size / 1000} TB` : `${size} GB`}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs text-[#7A7D70]">
                  <span>Used Space Slider: <strong className="text-[#2C2E25]">{usedDriveGB} GB</strong></span>
                  <span className="font-bold">{usedPercent}% full</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max={totalDriveGB}
                  value={usedDriveGB}
                  onChange={(e) => setUsedDriveGB(Number(e.target.value))}
                  className="w-full h-2 bg-[#E8EAE0] rounded-lg appearance-none cursor-pointer accent-[#7D8F69]"
                />
              </div>
            </div>
          )}

          {/* Natural Tones Styled Disk Bar */}
          <div className="space-y-2.5">
            <div className="h-5 w-full bg-[#F0F1EB] rounded-full overflow-hidden border border-[#E8EAE0] flex relative p-0.5">
              {/* Used Space */}
              <div
                style={{ width: `${usedPercent}%` }}
                className={`h-full rounded-full transition-all duration-500 relative ${
                  isCritical
                    ? 'bg-[#C47D5C] shadow-sm'
                    : 'bg-[#7D8F69]'
                }`}
              />
              {/* Estimated Reclaimable Overlay Marker */}
              {avgReclaim > 0 && (
                <div
                  style={{
                    width: `${Math.min(usedPercent, (avgReclaim / totalDriveGB) * 100)}%`,
                    left: `${Math.max(0, usedPercent - (avgReclaim / totalDriveGB) * 100)}%`,
                  }}
                  className="absolute top-0.5 bottom-0.5 bg-[#A8B799] border-y border-[#556345] rounded-full opacity-90 animate-pulse"
                  title="Estimated reclaimable space"
                />
              )}
            </div>

            {/* Visual Status Indicator Pill */}
            <div className={`flex items-center justify-between text-xs px-3.5 py-2 rounded-2xl border ${statusBorder} ${statusBg}`}>
              <div className="flex items-center gap-2">
                {isCritical ? (
                  <AlertTriangle className="w-4 h-4 text-[#B85338] flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#7D8F69] flex-shrink-0" />
                )}
                <span className={`font-semibold ${statusTextColor}`}>
                  {statusText}
                </span>
              </div>
              <span className="text-[#7A7D70] font-mono font-bold">
                {usedPercent}% capacity
              </span>
            </div>
          </div>
        </div>

        {/* Space Recovery Impact Forecast */}
        <div className="lg:col-span-6 bg-[#F8F9F5] rounded-[28px] p-5 sm:p-6 border border-[#E8EAE0] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3D4035] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-[#7D8F69]" />
              <span>Natural Space Recovery</span>
            </div>
            <div className="text-xs bg-[#E8EAE0] text-[#556345] border border-[#D4D8C8] px-3 py-1 rounded-full font-bold">
              +{avgReclaim.toFixed(1)} GB Available Space
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white rounded-2xl p-3.5 border border-[#E8EAE0] shadow-sm">
              <span className="text-[11px] font-semibold text-[#7A7D70] block mb-0.5">Current Free Space</span>
              <span className="text-2xl font-bold text-[#2C2E25]">
                {freeDriveGB.toFixed(1)} <span className="text-xs font-normal text-[#7A7D70]">GB</span>
              </span>
              <span className="text-[10px] text-[#7A7D70] block mt-0.5">({(100 - usedPercent)}% free)</span>
            </div>

            <div className="bg-gradient-to-br from-[#F0F1EB] to-white rounded-2xl p-3.5 border border-[#D4D8C8] shadow-sm">
              <span className="text-[11px] text-[#556345] block mb-0.5 font-bold">After Clean Free Space</span>
              <span className="text-2xl font-bold text-[#556345]">
                ~{simulatedAfterFreeGB.toFixed(1)} <span className="text-xs font-normal text-[#7D8F69]">GB</span>
              </span>
              <span className="text-[10px] text-[#556345]/90 block mt-0.5 font-medium">({(100 - simulatedAfterPercent)}% free)</span>
            </div>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-[#7A7D70] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7D8F69]" />
              Natural Optimization Presets:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CLEANUP_PRESETS.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onApplyPreset(preset.id)}
                    className={`p-2.5 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#7D8F69] border-[#7D8F69] text-white shadow-md shadow-[#7D8F6933]'
                        : 'bg-white border-[#E8EAE0] text-[#3D4035] hover:bg-[#F0F1EB] hover:border-[#D4D8C8]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {isSelected ? (
                        <div className="text-white">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        presetIcons[preset.icon] || <Shield className="w-3.5 h-3.5 text-[#7D8F69]" />
                      )}
                      <span className="font-bold truncate">{preset.name.split(' ')[0]}</span>
                    </div>
                    <span className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[#7A7D70]'}`}>
                      {preset.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
