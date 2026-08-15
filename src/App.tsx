/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DriveVisualizer } from './components/DriveVisualizer';
import { CleanupItemList } from './components/CleanupItemList';
import { ScriptGenerator } from './components/ScriptGenerator';
import { NativeToolsCheatsheet } from './components/NativeToolsCheatsheet';
import { DiskTreemapVisualizer } from './components/DiskTreemapVisualizer';
import { FolderRelocationGuide } from './components/FolderRelocationGuide';
import { QuickDiagnosisModal } from './components/QuickDiagnosisModal';
import { HowToRunModal } from './components/HowToRunModal';
import { CLEANUP_ITEMS, CLEANUP_PRESETS } from './data/cleanupCategories';
import { ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'cleaner' | 'generator' | 'native_tools' | 'treemap' | 'relocation'>('cleaner');

  // Drive state
  const [totalDriveGB, setTotalDriveGB] = useState<number>(256);
  const [usedDriveGB, setUsedDriveGB] = useState<number>(224);
  const [isSSD, setIsSSD] = useState<boolean>(true);

  // Selected items state (default selected items)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    CLEANUP_ITEMS.forEach((item) => {
      if (item.isDefaultSelected) {
        initial.add(item.id);
      }
    });
    return initial;
  });

  const [activePreset, setActivePreset] = useState<string | null>('quick_safe');

  // Modals
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState<boolean>(false);
  const [isHowToRunOpen, setIsHowToRunOpen] = useState<boolean>(false);

  // Filtered array of selected items
  const selectedItems = useMemo(() => {
    return CLEANUP_ITEMS.filter((item) => selectedIds.has(item.id));
  }, [selectedIds]);

  // Estimated Reclaim calculations
  const { estimatedReclaimMinGB, estimatedReclaimMaxGB } = useMemo(() => {
    let minMB = 0;
    let maxMB = 0;
    selectedItems.forEach((item) => {
      minMB += item.typicalSizeMinMB;
      maxMB += item.typicalSizeMaxMB;
    });
    return {
      estimatedReclaimMinGB: Number((minMB / 1000).toFixed(1)),
      estimatedReclaimMaxGB: Number((maxMB / 1000).toFixed(1)),
    };
  }, [selectedItems]);

  // Handlers
  const handleToggleItem = (id: string) => {
    setActivePreset(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllSafe = () => {
    setActivePreset('quick_safe');
    const next = new Set<string>();
    CLEANUP_ITEMS.forEach((item) => {
      if (item.safety === 'safe') {
        next.add(item.id);
      }
    });
    setSelectedIds(next);
  };

  const handleSelectRecommended = () => {
    setActivePreset('deep_system');
    const next = new Set<string>();
    CLEANUP_ITEMS.forEach((item) => {
      if (item.safety === 'safe' || item.safety === 'recommended') {
        next.add(item.id);
      }
    });
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    setActivePreset(null);
    const next = new Set<string>(CLEANUP_ITEMS.map((item) => item.id));
    setSelectedIds(next);
  };

  const handleClearAll = () => {
    setActivePreset(null);
    setSelectedIds(new Set<string>());
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = CLEANUP_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setActivePreset(preset.id);
      setSelectedIds(new Set(preset.itemIds));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#3D4035] antialiased selection:bg-[#7D8F69] selection:text-white pb-20">
      {/* Header Navigation in Natural Tones */}
      <Header
        onOpenDiagnosis={() => setIsDiagnosisOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCount={selectedIds.size}
        estimatedReclaimMinGB={estimatedReclaimMinGB.toString()}
        estimatedReclaimMaxGB={estimatedReclaimMaxGB.toString()}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Drive Capacity & Forecast Gauge */}
        <DriveVisualizer
          totalDriveGB={totalDriveGB}
          setTotalDriveGB={setTotalDriveGB}
          usedDriveGB={usedDriveGB}
          setUsedDriveGB={setUsedDriveGB}
          isSSD={isSSD}
          setIsSSD={setIsSSD}
          estimatedReclaimMinGB={estimatedReclaimMinGB}
          estimatedReclaimMaxGB={estimatedReclaimMaxGB}
          activePreset={activePreset}
          onApplyPreset={handleApplyPreset}
        />

        {/* Tab Content */}
        {activeTab === 'cleaner' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-[28px] border border-[#E8EAE0] shadow-sm">
              <div>
                <h2 className="text-base font-bold text-[#2C2E25]">Select Items to Clean from C: Drive</h2>
                <p className="text-xs text-[#7A7D70] mt-0.5">
                  Select the caches, log files, and system stores you wish to purge, then switch to the Script tab or run them manually.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('generator')}
                className="px-5 py-2.5 rounded-2xl bg-[#7D8F69] hover:bg-[#6B7C5A] text-white text-xs font-bold shadow-md shadow-[#7D8F6933] transition flex items-center gap-2 whitespace-nowrap active:scale-95"
              >
                <span>Generate Automation Script ({selectedIds.size})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <CleanupItemList
              items={CLEANUP_ITEMS}
              selectedIds={selectedIds}
              onToggleItem={handleToggleItem}
              onSelectAllSafe={handleSelectAllSafe}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              onSelectRecommended={handleSelectRecommended}
            />
          </div>
        )}

        {activeTab === 'generator' && (
          <ScriptGenerator
            selectedItems={selectedItems}
            onOpenHowToRun={() => setIsHowToRunOpen(true)}
          />
        )}

        {activeTab === 'native_tools' && (
          <NativeToolsCheatsheet />
        )}

        {activeTab === 'treemap' && (
          <DiskTreemapVisualizer />
        )}

        {activeTab === 'relocation' && (
          <FolderRelocationGuide />
        )}

      </main>

      {/* Modals */}
      <QuickDiagnosisModal
        isOpen={isDiagnosisOpen}
        onClose={() => setIsDiagnosisOpen(false)}
        onApplyPreset={handleApplyPreset}
      />

      <HowToRunModal
        isOpen={isHowToRunOpen}
        onClose={() => setIsHowToRunOpen(false)}
      />
    </div>
  );
}
