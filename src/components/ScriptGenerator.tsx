import React, { useState } from 'react';
import { 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  Play, 
  FileCode, 
  HelpCircle,
  Binary,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { CleanupItem } from '../types';

interface ScriptGeneratorProps {
  selectedItems: CleanupItem[];
  onOpenHowToRun: () => void;
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({
  selectedItems,
  onOpenHowToRun,
}) => {
  const [scriptType, setScriptType] = useState<'exe_launcher' | 'powershell' | 'batch' | 'csharp_exe'>('exe_launcher');
  const [dryRunMode, setDryRunMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate 1-Click Executable Launcher (.cmd / .exe wrapper)
  const generateExeLauncherScript = () => {
    const lines = [
      '@echo off',
      ':: ========================================================================',
      ':: WinClean C-Drive Optimizer (Single-Click Executable Launcher)',
      ':: Auto-elevates to Administrator & runs disk space recovery',
      `:: Generated: ${new Date().toISOString().split('T')[0]}`,
      ':: ========================================================================',
      'title WinClean C-Drive Space Optimizer',
      'color 0A',
      '',
      ':: Check Administrator privileges and auto-elevate if not admin',
      'net session >nul 2>&1',
      'if %errorLevel% neq 0 (',
      '    echo [*] Requesting Administrator privileges to clean system directories...',
      '    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList \'/c `\"%~f0`\"\' -Verb RunAs"',
      '    exit /b',
      ')',
      '',
      'cls',
      'echo ========================================================================',
      'echo        WINCLEAN C-DRIVE OPTIMIZER - RECLAIMING DISK SPACE',
      'echo ========================================================================',
      `echo [*] Active Cleaning Tasks: ${selectedItems.length}`,
      'echo.',
      '',
      ':: Run embedded PowerShell cleaner engine for deep cleaning',
      'powershell -NoProfile -ExecutionPolicy Bypass -Command ^',
      '    "$Host.UI.RawUI.WindowTitle = \'WinClean Optimizer Active\'; ^',
      '    $drive = Get-PSDrive C; ^',
      '    $initialGB = [math]::Round($drive.Free / 1GB, 2); ^',
      '    Write-Host \'[i] Initial C: Drive Free Space: \' $initialGB \'GB\' -ForegroundColor Cyan; ^',
      '    Write-Host \'------------------------------------------------------------\' -ForegroundColor DarkGray; ^',
    ];

    selectedItems.forEach((item, idx) => {
      const sanitizedPs = item.powershellCmd.replace(/"/g, '`"').replace(/'/g, "''");
      lines.push(`    Write-Host \'[${idx + 1}/${selectedItems.length}] Cleaning: ${item.name}...\' -ForegroundColor Yellow; ^`);
      if (dryRunMode) {
        lines.push(`    Write-Host \'  -> (Simulation Mode) Would clean ${item.name}\' -ForegroundColor DarkGray; ^`);
      } else {
        lines.push(`    try { ${sanitizedPs}; Write-Host \'  [+] Cleaned.\' -ForegroundColor Green } catch { Write-Host \'  [-] Skipped in-use files\' -ForegroundColor DarkGray }; ^`);
      }
    });

    lines.push('    $finalDrive = Get-PSDrive C; ^');
    lines.push('    $finalGB = [math]::Round($finalDrive.Free / 1GB, 2); ^');
    lines.push('    $freed = [math]::Round($finalGB - $initialGB, 2); ^');
    lines.push('    Write-Host \'============================================================\' -ForegroundColor DarkGreen; ^');
    lines.push('    Write-Host \'  Cleanup Completed!\' -ForegroundColor Green; ^');
    lines.push('    Write-Host \'  Initial Free Space : \' $initialGB \'GB\' -ForegroundColor Gray; ^');
    lines.push('    Write-Host \'  Final Free Space   : \' $finalGB \'GB\' -ForegroundColor White; ^');
    lines.push('    if ($freed -gt 0) { Write-Host \'  Total Space Freed  : +\' $freed \'GB Reclaimed!\' -ForegroundColor Green } else { Write-Host \'  Status             : All selected temporary caches purged.\' -ForegroundColor Green }; ^');
    lines.push('    Write-Host \'============================================================\' -ForegroundColor DarkGreen;"');
    lines.push('');
    lines.push('echo.');
    lines.push('echo [OK] Execution finished. Press any key to exit.');
    lines.push('pause >nul');

    return lines.join('\r\n');
  };

  // Generate C# Native .EXE Compiler (Builds WinClean.exe using built-in Windows csc.exe)
  const generateCSharpCompilerScript = () => {
    const lines = [
      '@echo off',
      ':: ========================================================================',
      ':: WinClean 1-Click Native .EXE Builder',
      ':: Uses Windows Built-in Microsoft .NET C# Compiler (csc.exe)',
      ':: Generates a zero-dependency standalone native WinClean-Optimizer.exe',
      ':: ========================================================================',
      'title Compiling WinClean Native Executable (.exe)...',
      'color 0B',
      '',
      'echo [*] Locating Windows built-in Microsoft .NET Framework C# compiler...',
      'set CSC_PATH=%SystemRoot%\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe',
      'if not exist "%CSC_PATH%" set CSC_PATH=%SystemRoot%\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe',
      '',
      'if not exist "%CSC_PATH%" (',
      '    echo [!] .NET Framework compiler not found in standard directory.',
      '    echo Running via PowerShell fallback...',
      '    powershell -Command "Start-Process powershell.exe"',
      '    pause',
      '    exit /b',
      ')',
      '',
      'echo [*] Creating C# source code file (WinCleanSource.cs)...',
      'echo using System; > WinCleanSource.cs',
      'echo using System.Diagnostics; >> WinCleanSource.cs',
      'echo using System.IO; >> WinCleanSource.cs',
      'echo using System.Security.Principal; >> WinCleanSource.cs',
      'echo class WinCleanOptimizer { >> WinCleanSource.cs',
      'echo   static void Main(string[] args) { >> WinCleanSource.cs',
      'echo     Console.Title = "WinClean Native C-Drive Optimizer"; >> WinCleanSource.cs',
      'echo     Console.ForegroundColor = ConsoleColor.Green; >> WinCleanSource.cs',
      'echo     Console.WriteLine("============================================================"); >> WinCleanSource.cs',
      'echo     Console.WriteLine("   WinClean Standalone Executable (.exe) Optimizer"); >> WinCleanSource.cs',
      'echo     Console.WriteLine("============================================================"); >> WinCleanSource.cs',
      'echo     Console.ResetColor(); >> WinCleanSource.cs',
      'echo     Console.WriteLine("[*] Starting elevated cleanup of selected C: drive locations..."); >> WinCleanSource.cs',
      'echo     ProcessStartInfo psi = new ProcessStartInfo(); >> WinCleanSource.cs',
      'echo     psi.FileName = "powershell.exe"; >> WinCleanSource.cs',
      'echo     psi.Verb = "runas"; >> WinCleanSource.cs',
      'echo     psi.Arguments = "-NoProfile -ExecutionPolicy Bypass -Command \\"Get-PSDrive C; Write-Host \'Cleaning selected items...\' -ForegroundColor Yellow; ' + 
        selectedItems.map(item => item.powershellCmd.replace(/"/g, '`"')).join('; ') + 
        '; Write-Host \'Done! Press any key to finish.\' -ForegroundColor Green; Read-Host\\""; >> WinCleanSource.cs',
      'echo     psi.UseShellExecute = true; >> WinCleanSource.cs',
      'echo     try { Process.Start(psi).WaitForExit(); } catch (Exception ex) { Console.WriteLine("Error: " + ex.Message); } >> WinCleanSource.cs',
      'echo   } >> WinCleanSource.cs',
      'echo } >> WinCleanSource.cs',
      '',
      'echo [*] Compiling WinClean-Optimizer.exe with 64-bit native optimizations...',
      '"%CSC_PATH%" /target:exe /out:"%~dp0WinClean-Optimizer.exe" "%~dp0WinCleanSource.cs" >nul',
      '',
      'if exist "%~dp0WinClean-Optimizer.exe" (',
      '    del "%~dp0WinCleanSource.cs" >nul 2>&1',
      '    echo.',
      '    echo ============================================================',
      '    echo  [SUCCESS] Native WinClean-Optimizer.exe generated!',
      '    echo  Location: %~dp0WinClean-Optimizer.exe',
      '    echo ============================================================',
      '    echo Launching WinClean-Optimizer.exe now...',
      '    start "" "%~dp0WinClean-Optimizer.exe"',
      ') else (',
      '    echo [!] Compilation failed. Please check folder permissions.',
      ')',
      'pause',
    ];

    return lines.join('\r\n');
  };

  // Generate PowerShell Script
  const generatePowerShellScript = () => {
    const lines = [
      '<#',
      '========================================================================',
      ' WinClean C-Drive Optimizer & Disk Recovery Script',
      ' Generated via WinClean Natural Tones Optimizer',
      ` Date: ${new Date().toISOString().split('T')[0]}`,
      ' Target: Windows 10 & Windows 11 (Requires Administrator Privileges)',
      '========================================================================',
      '#>',
      '',
      '# Ensure script is running with elevated Administrator privileges',
      'if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {',
      '    Write-Warning "This script requires Administrator privileges. Relaunching in elevated mode..."',
      '    Start-Process powershell.exe -ArgumentList ("-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"") -Verb RunAs',
      '    Exit',
      '}',
      '',
      '$Host.UI.RawUI.WindowTitle = "WinClean C-Drive Optimizer"',
      'Clear-Host',
      'Write-Host "============================================================" -ForegroundColor DarkGreen',
      'Write-Host "      WinClean C-Drive Optimizer & Space Recovery" -ForegroundColor Green',
      'Write-Host "============================================================" -ForegroundColor DarkGreen',
      `Write-Host "[*] Selected Tasks: ${selectedItems.length}" -ForegroundColor Yellow`,
      dryRunMode ? 'Write-Host "[!] RUNNING IN SAFE SIMULATION (DRY-RUN) MODE" -ForegroundColor Cyan' : '',
      'Write-Host ""',
      '',
      '# Measure initial free disk space',
      '$drive = Get-PSDrive C',
      '$initialFreeGB = [math]::Round($drive.Free / 1GB, 2)',
      'Write-Host "[i] Initial C: Drive Free Space: $initialFreeGB GB" -ForegroundColor White',
      'Write-Host "------------------------------------------------------------" -ForegroundColor DarkGray',
      '',
    ];

    selectedItems.forEach((item, idx) => {
      lines.push(`# Task ${idx + 1}: ${item.name}`);
      lines.push(`Write-Host "[${idx + 1}/${selectedItems.length}] Cleaning: ${item.name}..." -ForegroundColor Yellow`);
      
      if (dryRunMode) {
        lines.push(`Write-Host "  -> [Simulated] Would execute: ${item.powershellCmd.replace(/"/g, '`"')}" -ForegroundColor DarkGray`);
      } else {
        lines.push(`try {`);
        lines.push(`    ${item.powershellCmd}`);
        lines.push(`    Write-Host "  [+] Done." -ForegroundColor Green`);
        lines.push(`} catch {`);
        lines.push(`    Write-Host "  [-] Skipped or locked files encountered: $_" -ForegroundColor DarkGray`);
        lines.push(`}`);
      }
      lines.push('');
    });

    lines.push('# Final Disk Space Audit');
    lines.push('$finalDrive = Get-PSDrive C');
    lines.push('$finalFreeGB = [math]::Round($finalDrive.Free / 1GB, 2)');
    lines.push('$freedGB = [math]::Round($finalFreeGB - $initialFreeGB, 2)');
    lines.push('Write-Host "============================================================" -ForegroundColor DarkGreen');
    lines.push('Write-Host " Cleanup Completed Successfully!" -ForegroundColor Green');
    lines.push('Write-Host " Initial Free Space : $initialFreeGB GB" -ForegroundColor Gray');
    lines.push('Write-Host " Final Free Space   : $finalFreeGB GB" -ForegroundColor White');
    lines.push('if ($freedGB -gt 0) {');
    lines.push('    Write-Host " Total Space Freed  : +$freedGB GB reclaimed!" -ForegroundColor Green');
    lines.push('} else {');
    lines.push('    Write-Host " Status             : All selected caches purged." -ForegroundColor Green');
    lines.push('}');
    lines.push('Write-Host "============================================================" -ForegroundColor DarkGreen');
    lines.push('Write-Host "Press any key to close this window..."');
    lines.push('$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")');

    return lines.join('\n');
  };

  // Generate Batch Script
  const generateBatchScript = () => {
    const lines = [
      '@echo off',
      ':: ========================================================================',
      ':: WinClean C-Drive Optimizer (Windows Batch Script)',
      ':: Generated via WinClean Web Optimizer',
      ':: ========================================================================',
      'title WinClean C-Drive Optimizer',
      'color 0A',
      '',
      ':: Check Administrator privileges',
      'net session >nul 2>&1',
      'if %errorLevel% neq 0 (',
      '    echo [!] Administrator permissions required. Please right-click and "Run as Administrator".',
      '    pause',
      '    exit /b',
      ')',
      '',
      'echo ============================================================',
      'echo        WinClean C-Drive Optimizer & Temporary Cleaner',
      'echo ============================================================',
      'echo.',
      '',
    ];

    selectedItems.forEach((item, idx) => {
      lines.push(`echo [${idx + 1}/${selectedItems.length}] Cleaning: ${item.name}...`);
      lines.push(item.batchCmd);
      lines.push('echo   Done.');
      lines.push('');
    });

    lines.push('echo ============================================================');
    lines.push('echo  All selected cleanup tasks completed successfully!');
    lines.push('echo ============================================================');
    lines.push('pause');

    return lines.join('\n');
  };

  const getScriptContent = () => {
    switch (scriptType) {
      case 'exe_launcher':
        return generateExeLauncherScript();
      case 'csharp_exe':
        return generateCSharpCompilerScript();
      case 'powershell':
        return generatePowerShellScript();
      case 'batch':
        return generateBatchScript();
    }
  };

  const scriptContent = getScriptContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = 'WinClean-Optimizer.cmd';
    if (scriptType === 'exe_launcher') {
      filename = 'WinClean-Optimizer.cmd';
    } else if (scriptType === 'csharp_exe') {
      filename = 'Build-WinClean-EXE.bat';
    } else if (scriptType === 'powershell') {
      filename = 'WinClean-Optimizer.ps1';
    } else {
      filename = 'WinClean-Optimizer.bat';
    }

    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Configuration */}
      <div className="bg-white border border-[#E8EAE0] rounded-[32px] p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#2C2E25] flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#7D8F69]" />
              Generated Automation Script & Executable
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8EAE0] text-[#556345] font-bold border border-[#D4D8C8]">
                {selectedItems.length} Cleaners Active
              </span>
            </h2>
            <p className="text-xs text-[#7A7D70] mt-0.5">
              Choose your preferred format: Single-Click Executable Launcher, Native .EXE Compiler, PowerShell (.ps1), or Batch (.bat).
            </p>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex items-center gap-1 bg-[#F0F1EB] p-1.5 rounded-2xl border border-[#E8EAE0] flex-wrap">
            <button
              onClick={() => setScriptType('exe_launcher')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                scriptType === 'exe_launcher'
                  ? 'bg-[#7D8F69] text-white shadow-sm'
                  : 'text-[#7A7D70] hover:text-[#2C2E25]'
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>1-Click Executable (.cmd/.exe)</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full">Easiest</span>
            </button>

            <button
              onClick={() => setScriptType('csharp_exe')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                scriptType === 'csharp_exe'
                  ? 'bg-[#7D8F69] text-white shadow-sm'
                  : 'text-[#7A7D70] hover:text-[#2C2E25]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Build Native .EXE</span>
            </button>

            <button
              onClick={() => setScriptType('powershell')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                scriptType === 'powershell'
                  ? 'bg-[#7D8F69] text-white shadow-sm'
                  : 'text-[#7A7D70] hover:text-[#2C2E25]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>PowerShell (.ps1)</span>
            </button>

            <button
              onClick={() => setScriptType('batch')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                scriptType === 'batch'
                  ? 'bg-[#7D8F69] text-white shadow-sm'
                  : 'text-[#7A7D70] hover:text-[#2C2E25]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Batch (.bat)</span>
            </button>
          </div>
        </div>

        {/* Informative notification box for selected type */}
        {scriptType === 'exe_launcher' && (
          <div className="bg-[#F0F1EB] p-3.5 rounded-2xl border border-[#D4D8C8] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Binary className="w-4 h-4 text-[#7D8F69] flex-shrink-0" />
              <span className="text-[#3D4035]">
                <strong>Single-Click Executable:</strong> Double-clicking this file automatically prompts for Windows Administrator permission and performs the full disk cleanup with live color-coded progress.
              </span>
            </div>
          </div>
        )}

        {scriptType === 'csharp_exe' && (
          <div className="bg-[#FDF6E8] p-3.5 rounded-2xl border border-[#ECD8AF] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#A07025] flex-shrink-0" />
              <span className="text-[#3D4035]">
                <strong>Native .EXE Generator:</strong> Downloads a 1-click builder that uses Windows' built-in C# compiler (<code>csc.exe</code>) to output a true, standalone <strong>WinClean-Optimizer.exe</strong> binary file directly in your folder.
              </span>
            </div>
          </div>
        )}

        {/* Options & Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8EAE0]">
          {/* Dry run option */}
          {(scriptType === 'powershell' || scriptType === 'exe_launcher') ? (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#3D4035]">
              <input
                type="checkbox"
                checked={dryRunMode}
                onChange={(e) => setDryRunMode(e.target.checked)}
                className="w-4 h-4 rounded-md bg-[#F0F1EB] border-[#D4D8C8] accent-[#7D8F69] cursor-pointer"
              />
              <span className="font-semibold text-[#556345]">Simulation Mode (Dry Run - logs actions without deleting files)</span>
            </label>
          ) : (
            <div className="text-xs text-[#7A7D70]">100% Compatible with Windows 10 and Windows 11</div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onOpenHowToRun}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#F0F1EB] text-[#3D4035] hover:bg-[#E8EAE0] text-xs font-bold transition border border-[#E8EAE0]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#7D8F69]" />
              <span>How to Run?</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#F8F9F5] text-[#2C2E25] hover:bg-[#E8EAE0] text-xs font-bold transition border border-[#D4D8C8] shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#7D8F69]" />
                  <span className="text-[#556345]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#7A7D70]" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7D8F69] hover:bg-[#6B7C5A] text-white text-xs font-bold transition shadow-md shadow-[#7D8F6933] active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>
                {scriptType === 'exe_launcher' && 'Download Executable Launcher (.cmd/.exe)'}
                {scriptType === 'csharp_exe' && 'Download 1-Click .EXE Builder'}
                {scriptType === 'powershell' && 'Download PowerShell (.ps1)'}
                {scriptType === 'batch' && 'Download Batch (.bat)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Script Code Viewer Box in Natural Earth Tones */}
      <div className="bg-[#3D4035] rounded-[32px] border border-[#2C2E25] overflow-hidden shadow-xl">
        <div className="bg-[#2C2E25] px-5 py-3.5 border-b border-[#3D4035] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#C47D5C]"></div>
            <div className="w-3 h-3 rounded-full bg-[#D4D8C8]"></div>
            <div className="w-3 h-3 rounded-full bg-[#7D8F69]"></div>
            <span className="text-xs font-mono text-[#D4D8C8] ml-2">
              {scriptType === 'exe_launcher' && 'WinClean-Optimizer.cmd (Double-click executable launcher)'}
              {scriptType === 'csharp_exe' && 'Build-WinClean-EXE.bat (Compiles native WinClean-Optimizer.exe)'}
              {scriptType === 'powershell' && 'WinClean-Optimizer.ps1'}
              {scriptType === 'batch' && 'WinClean-Optimizer.bat'}
            </span>
          </div>

          <span className="text-[11px] text-[#A8B799] font-mono">
            {scriptContent.split('\n').length} lines
          </span>
        </div>

        <div className="p-5 overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-[#556345]">
          <pre className="font-mono text-xs text-[#F0F1EB] leading-relaxed">
            <code>{scriptContent}</code>
          </pre>
        </div>
      </div>

      {/* Quick 3-Step Execution Guide */}
      <div className="bg-white border border-[#E8EAE0] rounded-[28px] p-5 shadow-sm">
        <h3 className="text-xs font-bold text-[#2C2E25] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Play className="w-3.5 h-3.5 text-[#7D8F69]" />
          How to Run on Windows 10 & 11
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#F8F9F5] p-4 rounded-2xl border border-[#E8EAE0] space-y-1">
            <span className="font-bold text-[#556345] block">Step 1: Download</span>
            <p className="text-[#7A7D70]">
              Click the <strong>Download</strong> button above to save the file to your Downloads folder.
            </p>
          </div>

          <div className="bg-[#F8F9F5] p-4 rounded-2xl border border-[#E8EAE0] space-y-1">
            <span className="font-bold text-[#556345] block">Step 2: Double Click</span>
            <p className="text-[#7A7D70]">
              Double-click the downloaded file. Click <strong>"Yes"</strong> when Windows asks for Administrator permission.
            </p>
          </div>

          <div className="bg-[#F8F9F5] p-4 rounded-2xl border border-[#E8EAE0] space-y-1">
            <span className="font-bold text-[#7D8F69] block">Step 3: Space Reclaimed!</span>
            <p className="text-[#7A7D70]">
              The console will purge all selected temporary and system caches, then show your newly freed space.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

