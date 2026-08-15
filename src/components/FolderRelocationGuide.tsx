import React from 'react';
import { FolderSync, ShieldCheck, AlertCircle } from 'lucide-react';
import { FOLDER_RELOCATION_TIPS } from '../data/windowsTools';

export const FolderRelocationGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white border border-[#E8EAE0] rounded-[32px] p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#F0F1EB] border border-[#E8EAE0] text-[#556345]">
            <FolderSync className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2C2E25]">
              Permanent Space Savings: Relocate Big Folders to Secondary Drives (D:, E:)
            </h2>
            <p className="text-xs text-[#7A7D70] mt-0.5">
              Temporary file cleaning gives you immediate breathing room, but relocating your massive default directories permanently prevents C: drive from filling up again.
            </p>
          </div>
        </div>
      </div>

      {/* Relocation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FOLDER_RELOCATION_TIPS.map((tip, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E8EAE0] rounded-[24px] p-6 space-y-4 flex flex-col justify-between hover:border-[#D4D8C8] transition shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-[#2C2E25]">{tip.title}</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F0F1EB] text-[#556345] border border-[#D4D8C8] whitespace-nowrap">
                  {tip.impact}
                </span>
              </div>

              <ol className="space-y-2.5 text-xs text-[#7A7D70]">
                {tip.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#F0F1EB] text-[#556345] text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#D4D8C8]">
                      {sIdx + 1}
                    </span>
                    <span className="leading-relaxed text-[#3D4035]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-3.5 border-t border-[#E8EAE0] flex items-center gap-2 text-[11px] text-[#556345] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#7D8F69]" />
              <span>Windows automatically remaps system explorer links.</span>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Tip: WSL2 / Docker Desktop migration */}
      <div className="bg-[#F8F9F5] border border-[#E8EAE0] rounded-[24px] p-4.5 flex items-start gap-3.5 text-xs">
        <AlertCircle className="w-5 h-5 text-[#C47D5C] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#2C2E25]">Developer Note (Docker & WSL2):</strong>
          <p className="text-[#7A7D70]">
            WSL2 stores Linux distribution virtual hard disks (<code>ext4.vhdx</code>) inside <code>%LOCALAPPDATA%\Docker\wsl\data</code>, which often grows to 50GB+. You can move this to D: drive using <code>wsl --export</code> and <code>wsl --import</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
