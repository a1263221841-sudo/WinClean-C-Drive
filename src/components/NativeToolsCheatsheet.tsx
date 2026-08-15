import React, { useState } from 'react';
import { 
  Command, 
  Copy, 
  Check, 
  Zap, 
  Cpu, 
  Info
} from 'lucide-react';
import { WINDOWS_NATIVE_TOOLS } from '../data/windowsTools';

export const NativeToolsCheatsheet: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickRunShortcuts = [
    { label: 'Storage Sense (Settings)', cmd: 'ms-settings:storagesense', desc: 'Directly opens Windows 10/11 auto-clean settings' },
    { label: 'User Temp Directory', cmd: '%temp%', desc: 'Opens AppData\\Local\\Temp in File Explorer' },
    { label: 'System Temp Directory', cmd: 'temp', desc: 'Opens C:\\Windows\\Temp' },
    { label: 'Disk Cleanup (cleanmgr)', cmd: 'cleanmgr', desc: 'Classic Microsoft Disk Cleanup GUI' },
    { label: 'Extended Secret Disk Cleanup', cmd: 'cleanmgr /sageset:1', desc: 'Unlocks hidden system checkboxes' },
    { label: 'Installed Apps / Programs', cmd: 'ms-settings:appsfeatures', desc: 'Sort by size to remove huge apps' },
    { label: 'System Properties (Advanced)', cmd: 'sysdm.cpl', desc: 'Manage Virtual Memory Pagefile & System Protection' },
    { label: 'Device & Disk Management', cmd: 'diskmgmt.msc', desc: 'View partition table, shrink/extend volume' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Run Box (Win + R) */}
      <div className="bg-white border border-[#E8EAE0] rounded-[32px] p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold text-[#2C2E25] flex items-center gap-2">
            <Command className="w-5 h-5 text-[#7D8F69]" />
            Windows Run Dialog Cheatsheet (Press Win + R)
          </h2>
          <p className="text-xs text-[#7A7D70] mt-0.5">
            Press <strong>Windows Key + R</strong> on your keyboard, paste any of these commands, and hit Enter to jump directly to hidden Windows clean tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {quickRunShortcuts.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#F8F9F5] p-3.5 rounded-2xl border border-[#E8EAE0] flex items-center justify-between gap-3 hover:border-[#D4D8C8] transition"
            >
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-[#2C2E25] block truncate">{item.label}</span>
                <code className="text-[11px] font-mono text-[#556345] bg-white px-2 py-0.5 rounded-lg border border-[#E8EAE0] inline-block mt-1 font-bold shadow-xs">
                  {item.cmd}
                </code>
                <span className="text-[10px] text-[#7A7D70] block mt-0.5 truncate">{item.desc}</span>
              </div>

              <button
                onClick={() => handleCopy(item.cmd, `quick-${idx}`)}
                className="p-2 rounded-xl bg-white hover:bg-[#F0F1EB] text-[#7A7D70] hover:text-[#2C2E25] border border-[#E8EAE0] transition flex-shrink-0 shadow-xs"
                title="Copy command"
              >
                {copiedId === `quick-${idx}` ? (
                  <Check className="w-4 h-4 text-[#7D8F69]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Dive Native Tools */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2C2E25] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#7D8F69]" />
            Built-in Windows Maintenance & Diagnostic Utilities
          </h2>
          <span className="text-xs text-[#7A7D70] font-medium">All tools are 100% native to Windows</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {WINDOWS_NATIVE_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="bg-white border border-[#E8EAE0] rounded-[24px] p-5 space-y-3.5 shadow-sm hover:border-[#D4D8C8] transition"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#F0F1EB] text-[#556345] border border-[#E8EAE0]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2C2E25]">{tool.name}</h3>
                    <span className="text-[11px] text-[#7A7D70]">{tool.purpose}</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-[#E8EAE0] text-[#556345] border border-[#D4D8C8]">
                  {tool.badge}
                </span>
              </div>

              <div className="bg-[#F8F9F5] p-3.5 rounded-2xl border border-[#E8EAE0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#7A7D70] tracking-wider block">Command / Execution:</span>
                  <code className="text-xs font-mono text-[#556345] font-bold block break-all">
                    {tool.command}
                  </code>
                </div>

                <button
                  onClick={() => handleCopy(tool.command, tool.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F0F1EB] text-[#3D4035] border border-[#D4D8C8] text-xs font-bold transition flex-shrink-0 shadow-xs"
                >
                  {copiedId === tool.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#7D8F69]" />
                      <span className="text-[#556345]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#7A7D70]" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xs text-[#7A7D70] flex items-start gap-2.5 bg-[#F0F1EB]/60 p-3 rounded-xl border border-[#E8EAE0]">
                <Info className="w-4 h-4 text-[#7D8F69] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2C2E25]">How to use: </strong>
                  {tool.howToRun}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
