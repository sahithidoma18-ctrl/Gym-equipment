import { Dumbbell, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-10 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Dumbbell className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">GymPulse AI</p>
              <p className="text-xs text-slate-500">
                Gym Equipment Availability Checker
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="h-3 w-3 text-emerald-400" /> Powered by Google Gemini AI
            </span>
            <span>•</span>
            <span>Persistent LocalStorage</span>
            <span>•</span>
            <span>Next.js App Router</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            Built for Computer Science & Engineering Workshop
          </div>
        </div>
      </div>
    </footer>
  );
}
