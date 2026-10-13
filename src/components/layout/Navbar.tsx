'use client';

import React, { useState } from 'react';
import { Dumbbell, ShieldCheck, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';
import { useEquipment } from '@/context/EquipmentContext';
import { AdminLoginModal } from '@/components/auth/AdminLoginModal';

export function Navbar() {
  const { stats, isAdmin, logoutAdmin, resetToDefault } = useEquipment();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
              <Dumbbell className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">GymPulse</span>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  AI-Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Real-Time Gym Equipment Availability Checker
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Live Availability Badge */}
            <div className="hidden md:flex items-center space-x-2 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">
                <strong className="text-emerald-400">{stats.available}</strong> / {stats.total} Available ({stats.availabilityRate}%)
              </span>
            </div>

            {/* Admin Controls */}
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-medium text-amber-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  Admin Mode Active
                </span>
                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                  title="Switch to Member view"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Exit Admin</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Reset to Default Data (useful for workshops & demos) */}
            <button
              onClick={() => {
                if (window.confirm('Reset all equipment to initial sample demo data?')) {
                  resetToDefault();
                }
              }}
              title="Reset to 10 sample equipment items"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
