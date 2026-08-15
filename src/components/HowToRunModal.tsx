import React, { useState } from 'react';
import { X, Terminal, Check, Copy, AlertTriangle, FileCode, Binary, Sparkles } from 'lucide-react';

interface HowToRunModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToRunModal: React.FC<HowToRunModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2E25]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E8EAE0] rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 bg-[#F8F9F5] border-b border-[#E8EAE0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#7D8F69] text-white shadow-sm">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C2E25]">How to Run on Windows 10 & 11</h3>
              <p className="text-xs text-[#7A7D70]">Instructions for Executable (.exe / .cmd), PowerShell (.ps1), and Batch (.bat)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7D70] hover:text-[#2C2E25] hover:bg-[#E8EAE0] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-[#3D4035]">
          
          {/* Method 0: Single-Click Executable */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#556345] flex items-center gap-2">
              <Binary className="w-4 h-4 text-[#7D8F69]" />
              Method 1: 1-Click Executable Launcher (.cmd / .exe) [Easiest]
            </h4>

            <div className="space-y-2.5 bg-[#F8F9F5] p-4 rounded-2xl border border-[#E8EAE0] text-[#7A7D70]">
              <p>
                <strong className="text-[#2C2E25]">Step 1:</strong> Download <strong>WinClean-Optimizer.cmd</strong>.
              </p>
              <p>
                <strong className="text-[#2C2E25]">Step 2:</strong> Double-click the downloaded file.
              </p>
              <p>
                <strong className="text-[#2C2E25]">Step 3:</strong> Windows will automatically ask for Administrator permission (UAC prompt). Click <strong>"Yes"</strong>, and it will clean your drive automatically!
              </p>
            </div>
          </div>

          {/* Method 0.5: Native .EXE Builder */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#556345] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7D8F69]" />
              Method 2: Build Native Standalone WinClean-Optimizer.exe
            </h4>

            <div className="space-y-2.5 bg-[#F8F9F5] p-4 rounded-2xl border border-[#E8EAE0] text-[#7A7D70]">
              <p>
                <strong className="text-[#2C2E25]">Step 1:</strong> Select <strong>"Build Native .EXE"</strong> and click Download.
              </p>
              <p>
                <strong className="text-[#2C2E25]">Step 2:</strong> Double-click <code>Build-WinClean-EXE.bat</code>.
              </p>
              <p>
                <strong className="text-[#2C2E25]">Step 3:</strong> It uses Windows' built-in C# compiler (<code>csc.exe</code>) to immediately create a pure standalone <strong>WinClean-Optimizer.exe</strong> file in that same folder and launches it for you!
              </p>
            </div>
          </div>

          {/* Method 1: PowerShell (.ps1) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#556345] flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#7D8F69]" />
              Method 3: Running PowerShell Script (.ps1)
            </h4>

            <div className="space-y-2.5 bg-[#F8F9F5] p-4 rounded-2xl border border-[#E8EAE0] text-[#7A7D70]">
              <p>
                <strong className="text-[#2C2E25]">Step 1:</strong> Save the downloaded <code>WinClean-Optimizer.ps1</code> file.
              </p>
              <p>
                <strong className="text-[#2C2E25]">Step 2:</strong> Right-click the file and click <strong>"Run with PowerShell"</strong>.
              </p>
              <p>
                <strong className="text-[#2C2E25]">Step 3:</strong> If Windows prompts that local scripts are restricted, open PowerShell as Administrator and run this once:
              </p>
              
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E8EAE0] shadow-xs">
                <code className="text-[#556345] font-mono text-[11px] font-bold">
                  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
                </code>
                <button
                  onClick={() => handleCopy('Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass', 'exec-pol')}
                  className="text-[#7A7D70] hover:text-[#2C2E25] ml-2 p-1.5 rounded-lg hover:bg-[#F0F1EB]"
                >
                  {copiedCmd === 'exec-pol' ? <Check className="w-3.5 h-3.5 text-[#7D8F69]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* SmartScreen / Antivirus note */}
          <div className="bg-[#FDF6E8] border border-[#ECD8AF] p-4 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#A07025] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#A07025] block">Windows SmartScreen Note:</span>
              <p className="text-[#7A7D70] text-[11px] leading-relaxed">
                Because this script was generated directly for your system rather than digitally signed by a commercial publisher, Windows SmartScreen may show a dialog saying <em>"Windows protected your PC"</em>. Click <strong>"More info"</strong> &rarr; <strong>"Run anyway"</strong>. All generated code is 100% transparent and inspectable in the script preview.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-[#F8F9F5] border-t border-[#E8EAE0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#7D8F69] hover:bg-[#6B7C5A] text-white text-xs font-bold transition shadow-sm"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};

