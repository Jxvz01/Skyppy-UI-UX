import React, { useState } from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const OtpVerificationModal: React.FC = () => {
  const { otpModalOpen, setOtpModalOpen, activeRequest, verifyOtp } = useDriverStore();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');

  if (!otpModalOpen || !activeRequest) return null;

  const targetOtp = activeRequest.otp || '4821';

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);
    setErrorMessage('');

    // Auto-focus next input
    if (cleanVal && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const entered = digits.join('');
    if (entered.length < 4) {
      setErrorMessage('Please enter all 4 digits of the start OTP.');
      return;
    }

    const result = verifyOtp(entered);
    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setDigits(['', '', '', '']);
      setErrorMessage('');
    }
  };

  const handleAutoFill = () => {
    const arr = targetOtp.split('');
    setDigits(arr);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">pin</span>
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Enter Start OTP
              </h3>
              <p className="text-xs text-slate-400">Ask passenger for their 4-digit code</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOtpModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Demo Helper Banner */}
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Demo Simulation OTP
            </span>
            <span className="font-mono font-extrabold text-base tracking-widest">{targetOtp}</span>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 active:scale-95 transition-colors shadow-xs"
          >
            Auto-fill
          </button>
        </div>

        {/* 4 Digit Inputs */}
        <div className="flex justify-center gap-3 my-1">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-14 h-14 text-center font-mono font-black text-2xl rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:bg-white focus:outline-none transition-all shadow-inner"
            />
          ))}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 border border-rose-200 dark:border-rose-800">
            <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setOtpModalOpen(false)}
            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleVerify}
            className="flex-[2] py-3 rounded-xl bg-primary text-white font-extrabold text-sm shadow-md hover:bg-primary/90 flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[19px]">check_circle</span>
            <span>Verify &amp; Start Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
