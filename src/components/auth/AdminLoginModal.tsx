'use client';

import React, { useState } from 'react';
import { Lock, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEquipment } from '@/context/EquipmentContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const { loginAdmin } = useEquipment();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const ok = loginAdmin(pin);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setPin('');
        onClose();
      }, 700);
    } else {
      setError('Invalid admin passcode. Hint: Use demo passcode "admin123"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Administrator Access</h3>
            <p className="text-xs text-slate-400">
              Unlock equipment editing, additions, status toggles, and deletions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Admin Passcode
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter passcode (e.g. admin123)"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Admin access granted!</span>
            </div>
          )}

          <div className="rounded-lg bg-slate-950/60 p-3 text-xs text-slate-400 border border-slate-800/80">
            <span className="font-semibold text-slate-300">Demo Passcode:</span>{' '}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 text-emerald-400 font-mono">
              admin123
            </code>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500"
            >
              Unlock Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
