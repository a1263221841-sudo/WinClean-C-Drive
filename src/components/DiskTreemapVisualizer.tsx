import React, { useState } from 'react';
import { Layers, Folder, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

interface FolderNode {
  id: string;
  name: string;
  path: string;
  percentage: number;
  typicalSizeGB: string;
  color: string;
  textColor: string;
  badge: string;
  description: string;
  commonHogs: string[];
  recommendedAction: string;
  cleanCommand?: string;
}

export const DiskTreemapVisualizer: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('users');

  const folderNodes: FolderNode[] = [
    {
      id: 'users',
      name: 'Users (AppData & Downloads)',
      path: 'C:\\Users\\<Username>',
      percentage: 42,
      typicalSizeGB: '35 - 150 GB',
      color: 'bg-[#7D8F69]/20 border-[#7D8F69] hover:bg-[#7D8F69]/30',
      textColor: 'text-[#556345]',
      badge: 'Biggest Variable Hog',
      description: 'Contains your personal downloads, browser caches, Discord/Spotify media, game launcher caches, and AppData scratch files.',
      commonHogs: [
        'AppData\\Local\\Temp & CrashDumps (5-20 GB)',
        'Downloads folder with large old installers (10-80 GB)',
        'AppData\\Local\\Google\\Chrome / Edge Cache (2-10 GB)',
        'AppData\\Roaming\\Apple Computer\\MobileSync\\Backup (iPhone backups 10-60 GB)',
        '.gradle, .npm, pip, docker cached layers (10-40 GB)',
      ],
      recommendedAction: 'Clean %TEMP%, move Downloads to D: drive, and run browser cache cleaner.',
      cleanCommand: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force',
    },
    {
      id: 'windows',
      name: 'Windows System Core',
      path: 'C:\\Windows',
      percentage: 26,
      typicalSizeGB: '25 - 45 GB',
      color: 'bg-[#688574]/20 border-[#688574] hover:bg-[#688574]/30',
      textColor: 'text-[#445E4F]',
      badge: 'Core OS',
      description: 'Contains the Windows operating system binaries, update repositories, driver store, and component store.',
      commonHogs: [
        'WinSxS Component Store (8-18 GB)',
        'SoftwareDistribution\\Download (2-15 GB update cache)',
        'C:\\Windows\\Temp (1-8 GB system temp files)',
        'C:\\Windows\\MEMORY.DMP (1-16 GB BSOD kernel dumps)',
        'C:\\Windows\\Installer (Hidden MSI cached installers)',
      ],
      recommendedAction: 'Run DISM Component Cleanup and delete SoftwareDistribution update cache.',
      cleanCommand: 'Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase',
    },
    {
      id: 'program_files',
      name: 'Program Files (x64 / x86)',
      path: 'C:\\Program Files & (x86)',
      percentage: 18,
      typicalSizeGB: '20 - 80 GB',
      color: 'bg-[#A8B799]/30 border-[#A8B799] hover:bg-[#A8B799]/40',
      textColor: 'text-[#556345]',
      badge: 'Installed Software',
      description: 'Contains your installed 64-bit and 32-bit desktop software, utility tools, and game client libraries.',
      commonHogs: [
        'Large software suites (Adobe Creative Cloud, Microsoft Office, Autodesk)',
        'Games installed accidentally to C: instead of secondary drive',
        'Outdated runtime frameworks and SDKs',
      ],
      recommendedAction: 'Open "Installed Apps" (ms-settings:appsfeatures), sort by size, and uninstall unused applications.',
      cleanCommand: 'ms-settings:appsfeatures',
    },
    {
      id: 'system_root_files',
      name: 'Hidden Root Files (Hiberfil & Pagefile)',
      path: 'C:\\hiberfil.sys & C:\\pagefile.sys',
      percentage: 9,
      typicalSizeGB: '10 - 45 GB',
      color: 'bg-[#C47D5C]/20 border-[#C47D5C] hover:bg-[#C47D5C]/30',
      textColor: 'text-[#A85838]',
      badge: 'RAM Mirroring',
      description: 'Special locked system root files dedicated to Windows Fast Startup/Hibernation (hiberfil.sys) and Virtual Memory paging (pagefile.sys).',
      commonHogs: [
        'hiberfil.sys reserves 40% to 100% of your total RAM (8GB - 64GB)',
        'pagefile.sys virtual memory swap cache (4GB - 32GB)',
        'C:\\$Recycle.Bin (Unemptied deleted files)',
        'C:\\Windows.old (Old Windows backup from upgrades)',
      ],
      recommendedAction: 'Run `powercfg -h off` to instantly reclaim full RAM size if you do not use hibernation.',
      cleanCommand: 'powercfg -h off',
    },
    {
      id: 'program_data',
      name: 'ProgramData (All Users)',
      path: 'C:\\ProgramData',
      percentage: 5,
      typicalSizeGB: '4 - 18 GB',
      color: 'bg-[#949887]/20 border-[#949887] hover:bg-[#949887]/30',
      textColor: 'text-[#4A4E40]',
      badge: 'Shared App Data',
      description: 'Shared application configurations, antivirus virus definition history, OEM manufacturer support caches, and Windows Error Reporting.',
      commonHogs: [
        'Microsoft\\Windows\\WER\\ReportArchive (Crash reports)',
        'NVIDIA / AMD / Intel driver installation archives',
        'Antivirus update repositories',
      ],
      recommendedAction: 'Clean Error reports and remove old GPU driver setup packages.',
      cleanCommand: 'Remove-Item -Path "C:\\ProgramData\\Microsoft\\Windows\\WER\\*" -Recurse -Force',
    },
  ];

  const selectedNode = folderNodes.find((n) => n.id === selectedNodeId) || folderNodes[0];

  return (
    <div className="space-y-6">
      {/* Visual Map Intro Card */}
      <div className="bg-white border border-[#E8EAE0] rounded-[32px] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#2C2E25] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#7D8F69]" />
              Windows C: Drive Storage Architecture & Space Breakdown
            </h2>
            <p className="text-xs text-[#7A7D70] mt-0.5">
              Click on any directory partition below to inspect what is consuming storage and how to clear it safely.
            </p>
          </div>
        </div>

        {/* Treemap Blocks */}
        <div className="grid grid-cols-12 gap-2.5 h-36 sm:h-28">
          {folderNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const colSpans: Record<string, string> = {
              users: 'col-span-12 sm:col-span-5',
              windows: 'col-span-6 sm:col-span-3',
              program_files: 'col-span-6 sm:col-span-2',
              system_root_files: 'col-span-6 sm:col-span-1',
              program_data: 'col-span-6 sm:col-span-1',
            };

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`${colSpans[node.id]} rounded-2xl border p-3 text-left transition flex flex-col justify-between relative overflow-hidden ${
                  node.color
                } ${isSelected ? 'ring-2 ring-[#556345] shadow-md' : 'opacity-90 hover:opacity-100'}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold truncate ${node.textColor}`}>
                    {node.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#2C2E25]">{node.percentage}%</span>
                </div>
                <div className="text-[10px] text-[#4A4E40] font-mono font-semibold truncate">
                  ~{node.typicalSizeGB}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Directory Inspector Panel */}
      <div className="bg-white border border-[#E8EAE0] rounded-[32px] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E8EAE0]">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#F0F1EB] border border-[#E8EAE0] text-[#556345]">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#2C2E25]">{selectedNode.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8EAE0] text-[#556345] border border-[#D4D8C8] font-bold">
                  {selectedNode.badge}
                </span>
              </div>
              <code className="text-xs font-mono text-[#556345] font-bold">{selectedNode.path}</code>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#7A7D70] block">Typical Storage Consumed:</span>
            <span className="text-base font-bold text-[#556345] font-mono">
              {selectedNode.typicalSizeGB}
            </span>
          </div>
        </div>

        {/* Directory details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          {/* Common Storage Hogs */}
          <div className="bg-[#F8F9F5] p-5 rounded-2xl border border-[#E8EAE0] space-y-3">
            <span className="font-bold text-[#2C2E25] uppercase tracking-wider block flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#C47D5C]" />
              Where the space accumulates:
            </span>
            <ul className="space-y-2 text-[#7A7D70]">
              {selectedNode.commonHogs.map((hog, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-[#7D8F69] flex-shrink-0 mt-0.5" />
                  <span>{hog}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Action */}
          <div className="bg-[#F8F9F5] p-5 rounded-2xl border border-[#E8EAE0] space-y-3.5 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="font-bold text-[#556345] uppercase tracking-wider block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7D8F69]" />
                Best Cleanup Strategy:
              </span>
              <p className="text-[#3D4035] leading-relaxed">
                {selectedNode.recommendedAction}
              </p>
            </div>

            {selectedNode.cleanCommand && (
              <div className="pt-3 border-t border-[#E8EAE0]">
                <span className="text-[10px] text-[#7A7D70] font-mono block mb-1 font-bold">Direct Command:</span>
                <code className="block bg-white p-2.5 rounded-xl border border-[#E8EAE0] font-mono text-[11px] text-[#556345] font-bold break-all shadow-xs">
                  {selectedNode.cleanCommand}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
