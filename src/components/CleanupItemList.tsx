import React, { useState } from 'react';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  AlertCircle, 
  FolderOpen, 
  Terminal, 
  Copy, 
  Info,
  CheckCheck
} from 'lucide-react';
import { CleanupItem, CategoryGroup, SafetyLevel } from '../types';

interface CleanupItemListProps {
  items: CleanupItem[];
  selectedIds: Set<string>;
  onToggleItem: (id: string) => void;
  onSelectAllSafe: () => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSelectRecommended: () => void;
}

export const CleanupItemList: React.FC<CleanupItemListProps> = ({
  items,
  selectedIds,
  onToggleItem,
  onSelectAllSafe,
  onSelectAll,
  onClearAll,
  onSelectRecommended,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryGroup | 'all'>('all');
  const [selectedSafety, setSelectedSafety] = useState<SafetyLevel | 'all'>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { key: CategoryGroup | 'all'; label: string }[] = [
    { key: 'all', label: 'All Items' },
    { key: 'temp_cache', label: 'Temp & Cache' },
    { key: 'windows_system', label: 'Windows System' },
    { key: 'gaming_browsers', label: 'Gaming & Browsers' },
    { key: 'user_appdata', label: 'Explorer & AppData' },
    { key: 'developer', label: 'Developer Tools' },
    { key: 'advanced_system', label: 'Deep OS Tuning' },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedSafety !== 'all' && item.safety !== selectedSafety) return false;
    return true;
  });

  const handleCopyCmd = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSafetyBadge = (safety: SafetyLevel) => {
    switch (safety) {
      case 'safe':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0F1EB] text-[#556345] border border-[#D4D8C8]">
            <ShieldCheck className="w-3 h-3 text-[#7D8F69]" /> Safe
          </span>
        );
      case 'recommended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8EAE0] text-[#3D4035] border border-[#D4D8C8]">
            <Info className="w-3 h-3 text-[#556345]" /> Recommended
          </span>
        );
      case 'advanced':
      case 'caution':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FDF6E8] text-[#A07025] border border-[#ECD8AF]">
            <AlertCircle className="w-3 h-3 text-[#C47D5C]" /> Advanced
          </span>
        );
    }
  };

  const formatSize = (minMB: number, maxMB: number) => {
    if (maxMB >= 1000) {
      return `${(minMB / 1000).toFixed(1)} - ${(maxMB / 1000).toFixed(0)} GB`;
    }
    return `${minMB} - ${maxMB} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Filters & Batch Selectors */}
      <div className="bg-white border border-[#E8EAE0] rounded-[24px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.key
                  ? 'bg-[#7D8F69] text-white shadow-sm'
                  : 'bg-[#F0F1EB] text-[#7A7D70] hover:text-[#2C2E25] hover:bg-[#E8EAE0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={onSelectAllSafe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F1EB] text-[#556345] border border-[#D4D8C8] hover:bg-[#E8EAE0] text-xs font-bold transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#7D8F69]" />
            <span>Safe Only</span>
          </button>

          <button
            onClick={onSelectRecommended}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8EAE0] text-[#2C2E25] border border-[#D4D8C8] hover:bg-[#D4D8C8] text-xs font-bold transition"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#556345]" />
            <span>Recommended Set</span>
          </button>

          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 rounded-xl bg-[#F8F9F5] text-[#3D4035] border border-[#E8EAE0] hover:bg-[#F0F1EB] text-xs font-semibold transition"
          >
            Select All
          </button>

          <button
            onClick={onClearAll}
            className="px-3 py-1.5 rounded-xl bg-[#F8F9F5] text-[#7A7D70] border border-[#E8EAE0] hover:bg-[#F0F1EB] hover:text-[#3D4035] text-xs font-semibold transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Item List Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isSelected = selectedIds.has(item.id);
          const isExpanded = expandedItemId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-[24px] border transition-all ${
                isSelected
                  ? 'bg-white border-[#7D8F69] shadow-[0_4px_16px_rgba(125,143,105,0.12)] ring-1 ring-[#7D8F69]'
                  : 'bg-white border-[#E8EAE0] hover:border-[#D4D8C8] text-[#3D4035] shadow-sm'
              }`}
            >
              {/* Header Row */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  
                  {/* Custom Styled Checkbox */}
                  <button
                    type="button"
                    onClick={() => onToggleItem(item.id)}
                    className={`w-6 h-6 rounded-xl flex items-center justify-center border transition flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#7D8F69] border-[#7D8F69] text-white shadow-sm'
                        : 'bg-[#F8F9F5] border-[#D4D8C8] hover:border-[#7D8F69]'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Title & Description */}
                  <div
                    onClick={() => onToggleItem(item.id)}
                    className="cursor-pointer min-w-0 flex-1"
                  >
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm font-bold text-[#2C2E25] truncate">
                        {item.name}
                      </h3>
                      {getSafetyBadge(item.safety)}
                    </div>
                    <p className="text-xs text-[#7A7D70] line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Size Pill & Expand Toggle */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold text-[#556345] font-mono">
                      ~{formatSize(item.typicalSizeMinMB, item.typicalSizeMaxMB)}
                    </span>
                    <span className="text-[10px] text-[#7A7D70] font-medium">{item.categoryLabel}</span>
                  </div>

                  <button
                    onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    className="p-2 rounded-xl text-[#7A7D70] hover:text-[#2C2E25] hover:bg-[#F0F1EB] transition"
                    title="View details, directory paths, and commands"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details Drawer */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-[#E8EAE0] bg-[#F8F9F5] rounded-b-[24px] space-y-4 text-xs text-[#3D4035] animate-in fade-in duration-200">
                  
                  {/* Why Clean & Risk Note */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="bg-white p-3.5 rounded-2xl border border-[#E8EAE0] shadow-sm">
                      <span className="font-bold text-[#556345] block mb-1">Why clean this?</span>
                      <p className="text-[#7A7D70] leading-relaxed">{item.whyClean}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-[#E8EAE0] shadow-sm">
                      <span className="font-bold text-[#A07025] block mb-1">Safety & Impact</span>
                      <p className="text-[#7A7D70] leading-relaxed">
                        {item.riskNote || 'Completely safe to delete. Windows or applications will seamlessly recreate fresh cache files when required.'}
                      </p>
                    </div>
                  </div>

                  {/* Target Paths */}
                  <div>
                    <span className="font-bold text-[#3D4035] flex items-center gap-1.5 mb-1.5">
                      <FolderOpen className="w-3.5 h-3.5 text-[#7D8F69]" />
                      Target Folders & Storage Locations:
                    </span>
                    <div className="space-y-1">
                      {item.detailedPath.map((path, idx) => (
                        <code
                          key={idx}
                          className="block bg-white px-3 py-1.5 rounded-xl border border-[#E8EAE0] font-mono text-[11px] text-[#556345] truncate shadow-sm"
                        >
                          {path}
                        </code>
                      ))}
                    </div>
                  </div>

                  {/* Manual Step */}
                  <div className="bg-white p-3.5 rounded-2xl border border-[#E8EAE0] shadow-sm">
                    <span className="font-bold text-[#2C2E25] block mb-1">Manual Step:</span>
                    <p className="text-[#7A7D70]">{item.manualStep}</p>
                  </div>

                  {/* PowerShell Command Preview with Copy */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[#7A7D70]">
                      <span className="flex items-center gap-1 font-mono text-[11px] font-semibold">
                        <Terminal className="w-3.5 h-3.5 text-[#7D8F69]" />
                        PowerShell Command (Admin):
                      </span>
                      <button
                        onClick={() => handleCopyCmd(item.powershellCmd, item.id)}
                        className="flex items-center gap-1 text-[11px] text-[#7D8F69] hover:text-[#556345] font-bold"
                      >
                        {copiedId === item.id ? (
                          <span className="text-[#556345] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Copy className="w-3.5 h-3.5" /> Copy Line
                          </span>
                        )}
                      </button>
                    </div>
                    <pre className="bg-[#3D4035] p-3 rounded-2xl border border-[#2C2E25] font-mono text-[11px] text-[#D4D8C8] overflow-x-auto shadow-inner">
                      {item.powershellCmd}
                    </pre>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
