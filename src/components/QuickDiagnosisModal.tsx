import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface QuickDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (presetId: string) => void;
}

export const QuickDiagnosisModal: React.FC<QuickDiagnosisModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  const [driveAlert, setDriveAlert] = useState<'red_full' | 'moderate' | 'maintenance'>('red_full');
  const [isGamer, setIsGamer] = useState<boolean>(true);
  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);
  const [useHibernation, setUseHibernation] = useState<boolean>(false);
  const [recentUpgrade, setRecentUpgrade] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (driveAlert === 'red_full' || recentUpgrade) {
      onApplyPreset('emergency_full_drive');
    } else if (isDeveloper) {
      onApplyPreset('developer_power');
    } else if (driveAlert === 'moderate') {
      onApplyPreset('deep_system');
    } else {
      onApplyPreset('quick_safe');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2E25]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E8EAE0] rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="p-6 bg-[#F8F9F5] border-b border-[#E8EAE0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#7D8F69] text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C2E25]">Smart C: Drive Diagnosis</h3>
              <p className="text-xs text-[#7A7D70]">Answer 4 quick questions for an optimized custom plan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A7D70] hover:text-[#2C2E25] hover:bg-[#E8EAE0] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Question 1: How full is C: drive? */}
          <div className="space-y-2">
            <label className="font-bold text-[#2C2E25] block">
              1. What is the current status of your C: drive?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'red_full', label: '🔴 Full (<10GB Free)', desc: 'Emergency' },
                { id: 'moderate', label: '🟡 Low (10-30GB)', desc: 'Needs Clean' },
                { id: 'maintenance', label: '🟢 Good (>30GB)', desc: 'Routine Clean' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDriveAlert(opt.id as any)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    driveAlert === opt.id
                      ? 'bg-[#7D8F69] border-[#7D8F69] text-white shadow-sm'
                      : 'bg-[#F8F9F5] border-[#E8EAE0] text-[#7A7D70] hover:bg-[#F0F1EB]'
                  }`}
                >
                  <span className="font-bold text-xs">{opt.label}</span>
                  <span className={`text-[10px] mt-1 ${driveAlert === opt.id ? 'text-white/80' : 'text-[#7A7D70]'}`}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Hibernation */}
          <div className="bg-[#F8F9F5] p-4 rounded-2xl border border-[#E8EAE0] flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[#2C2E25] block">Do you use Windows Hibernation?</span>
              <p className="text-[#7A7D70] text-[11px]">If no (you only use Sleep or Shutdown), turning it off saves 8GB - 32GB RAM size.</p>
            </div>
            <button
              type="button"
              onClick={() => setUseHibernation(!useHibernation)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                useHibernation ? 'bg-[#E8EAE0] border-[#D4D8C8] text-[#3D4035]' : 'bg-[#7D8F69] border-[#7D8F69] text-white shadow-sm'
              }`}
            >
              {useHibernation ? 'Yes (Keep)' : 'No (Reclaim)'}
            </button>
          </div>

          {/* Question 3: Recent Windows Upgrade */}
          <div className="bg-[#F8F9F5] p-4 rounded-2xl border border-[#E8EAE0] flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[#2C2E25] block">Did you recently upgrade or update Windows?</span>
              <p className="text-[#7A7D70] text-[11px]">Cleans <code>Windows.old</code> and old cumulative update installers.</p>
            </div>
            <button
              type="button"
              onClick={() => setRecentUpgrade(!recentUpgrade)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                recentUpgrade ? 'bg-[#7D8F69] border-[#7D8F69] text-white shadow-sm' : 'bg-[#E8EAE0] border-[#D4D8C8] text-[#7A7D70]'
              }`}
            >
              {recentUpgrade ? 'Yes (Include Windows.old)' : 'No'}
            </button>
          </div>

          {/* Question 4: Developer / Gamer */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsGamer(!isGamer)}
              className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                isGamer ? 'bg-[#F0F1EB] border-[#7D8F69] text-[#2C2E25]' : 'bg-[#F8F9F5] border-[#E8EAE0] text-[#7A7D70]'
              }`}
            >
              <div>
                <span className="font-bold text-xs block">🎮 PC Gamer</span>
                <span className="text-[10px] text-[#7A7D70]">Cleans GPU shader caches</span>
              </div>
              {isGamer && <CheckCircle2 className="w-4 h-4 text-[#7D8F69]" />}
            </button>

            <button
              type="button"
              onClick={() => setIsDeveloper(!isDeveloper)}
              className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                isDeveloper ? 'bg-[#F0F1EB] border-[#7D8F69] text-[#2C2E25]' : 'bg-[#F8F9F5] border-[#E8EAE0] text-[#7A7D70]'
              }`}
            >
              <div>
                <span className="font-bold text-xs block">💻 Developer / Coder</span>
                <span className="text-[10px] text-[#7A7D70]">Cleans NPM, Pip, Gradle</span>
              </div>
              {isDeveloper && <CheckCircle2 className="w-4 h-4 text-[#7D8F69]" />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#F8F9F5] border-t border-[#E8EAE0] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A7D70] hover:text-[#2C2E25]"
          >
            Cancel
          </button>

          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7D8F69] hover:bg-[#6B7C5A] text-white text-xs font-bold transition shadow-md shadow-[#7D8F6933]"
          >
            <span>Apply Recommended Clean Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
