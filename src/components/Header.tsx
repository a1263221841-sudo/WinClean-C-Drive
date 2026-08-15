import React from 'react';
import { HardDrive, Sparkles, Shield, Terminal, RefreshCw, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenDiagnosis: () => void;
  activeTab: 'cleaner' | 'generator' | 'native_tools' | 'treemap' | 'relocation';
  setActiveTab: (tab: 'cleaner' | 'generator' | 'native_tools' | 'treemap' | 'relocation') => void;
  selectedCount: number;
  estimatedReclaimMinGB: string;
  estimatedReclaimMaxGB: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDiagnosis,
  activeTab,
  setActiveTab,
  selectedCount,
  estimatedReclaimMinGB,
  estimatedReclaimMaxGB,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-[#E8EAE0] text-[#2C2E25] sticky top-0 z-40 shadow-[0_2px_12px_rgba(61,64,53,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#7D8F69] flex items-center justify-center shadow-md shadow-[#7D8F6933]">
                <HardDrive className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-[#2C2E25] flex items-center gap-2">
                    AuraDisk C: Optimizer
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#E8EAE0] text-[#556345] border border-[#D4D8C8]">
                      Win 10 & 11
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-[#7A7D70]">
                  Clean temporary files, optimize storage capacity, and generate safe automation scripts
                </p>
              </div>
            </div>

            {/* Mobile Diagnosis Button */}
            <button
              onClick={onOpenDiagnosis}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7D8F69] text-white text-xs font-semibold hover:bg-[#6B7C5A] transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Wizard</span>
            </button>
          </div>

          {/* Quick Metrics & Diagnosis Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="hidden sm:flex items-center gap-3 bg-[#F0F1EB] px-3.5 py-2 rounded-2xl border border-[#E8EAE0] text-xs">
              <div className="flex items-center gap-2 text-[#4A4E40]">
                <span className="w-2 h-2 rounded-full bg-[#7D8F69] animate-pulse"></span>
                <span>Selected: <strong className="text-[#2C2E25] font-bold">{selectedCount} items</strong></span>
              </div>
              <span className="text-[#D4D8C8]">|</span>
              <div className="text-[#556345] font-bold">
                Est. Reclaim: ~{estimatedReclaimMinGB} - {estimatedReclaimMaxGB} GB
              </div>
            </div>

            <button
              onClick={onOpenDiagnosis}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#7D8F69] hover:bg-[#6B7C5A] text-white text-xs font-bold shadow-md shadow-[#7D8F6933] transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F0F1EB]" />
              <span>Drive Diagnosis Wizard</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1.5 overflow-x-auto scrollbar-none border-t border-[#E8EAE0] pt-2 pb-2.5">
          <button
            onClick={() => setActiveTab('cleaner')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'cleaner'
                ? 'bg-[#7D8F69] text-white shadow-sm'
                : 'text-[#7A7D70] hover:text-[#2C2E25] hover:bg-[#E8EAE0]/70'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Cleanup Items & Checklist ({selectedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'generator'
                ? 'bg-[#7D8F69] text-white shadow-sm'
                : 'text-[#7A7D70] hover:text-[#2C2E25] hover:bg-[#E8EAE0]/70'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>PowerShell & Batch Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('native_tools')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'native_tools'
                ? 'bg-[#7D8F69] text-white shadow-sm'
                : 'text-[#7A7D70] hover:text-[#2C2E25] hover:bg-[#E8EAE0]/70'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Windows Built-in Tools & Run Shortcuts</span>
          </button>

          <button
            onClick={() => setActiveTab('treemap')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'treemap'
                ? 'bg-[#7D8F69] text-white shadow-sm'
                : 'text-[#7A7D70] hover:text-[#2C2E25] hover:bg-[#E8EAE0]/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>C: Drive Space Map & Hog Locator</span>
          </button>

          <button
            onClick={() => setActiveTab('relocation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'relocation'
                ? 'bg-[#7D8F69] text-white shadow-sm'
                : 'text-[#7A7D70] hover:text-[#2C2E25] hover:bg-[#E8EAE0]/70'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Move Folders & Games (D: Migration)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
