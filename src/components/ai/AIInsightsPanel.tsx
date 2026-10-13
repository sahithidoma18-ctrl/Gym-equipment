'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  RefreshCw,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useEquipment } from '@/context/EquipmentContext';
import { AIInsightResponse } from '@/types/equipment';

export function AIInsightsPanel() {
  const { equipment } = useEquipment();
  const [insights, setInsights] = useState<AIInsightResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate AI insights.');
      }

      setInsights(data);
      setIsExpanded(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyBadge = (urgency: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/20 shadow-xl backdrop-blur-sm">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 border-b border-slate-800/80 gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Gemini AI Equipment Intelligence
              </h3>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                Live Analysis
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluates maintenance priorities, bottleneck detection, and utilization recommendations
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={fetchInsights}
            disabled={isLoading || equipment.length === 0}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Analyzing Inventory...' : insights ? 'Refresh Analysis' : 'Run AI Analysis'}</span>
          </button>

          {insights && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:text-white"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-emerald-500" />
            <p className="text-sm font-medium text-slate-300">
              Processing {equipment.length} equipment units with Google Gemini API...
            </p>
            <p className="text-xs text-slate-500">
              Identifying maintenance bottlenecks & demand patterns
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">AI Analysis Notice</h4>
                <p className="mt-1 text-xs text-rose-200/90 leading-relaxed">{error}</p>
                <div className="mt-3 rounded-lg bg-slate-950/70 p-3 text-xs text-slate-300 border border-slate-800">
                  <span className="font-semibold text-emerald-400">Quick Configuration Fix:</span>{' '}
                  Add your Google Gemini API key into <code className="text-white font-mono">.env.local</code> as:
                  <div className="mt-1 text-emerald-300 font-mono text-[11px]">
                    GEMINI_API_KEY=your_actual_api_key_here
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Get a key instantly at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline text-emerald-400">aistudio.google.com</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty / Initial State */}
        {!isLoading && !error && !insights && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-400 mb-3 border border-slate-700/50">
              <Sparkles className="h-7 w-7 text-emerald-400" />
            </div>
            <h4 className="text-base font-semibold text-white">
              Ready to generate real-time AI gym insights
            </h4>
            <p className="mt-1 max-w-md text-xs text-slate-400">
              Click <strong>&quot;Run AI Analysis&quot;</strong> to have Google Gemini evaluate current equipment availability, flag machines requiring maintenance, and suggest operational optimizations.
            </p>
          </div>
        )}

        {/* Successful Analysis View */}
        {!isLoading && !error && insights && isExpanded && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Executive Summary */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 mb-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Executive Availability Summary</span>
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {insights.summary}
              </p>
              <div className="mt-3 flex items-center space-x-1.5 text-[11px] text-slate-500">
                <Clock className="h-3 w-3" />
                <span>Generated: {new Date(insights.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* 2. Maintenance Priorities & Demand Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Maintenance Priorities */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Maintenance Priority Ranking
                    </h4>
                  </div>

                  {insights.maintenancePriorities && insights.maintenancePriorities.length > 0 ? (
                    <div className="space-y-2.5">
                      {insights.maintenancePriorities.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-white truncate">
                              {item.equipmentName}
                            </span>
                            <span
                              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${getUrgencyBadge(
                                item.urgency
                              )}`}
                            >
                              {item.urgency} Urgency
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            {item.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      All units currently reported in stable condition with no urgent tickets.
                    </p>
                  )}
                </div>
              </div>

              {/* Demand Observations */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Demand & Bottleneck Observations
                    </h4>
                  </div>

                  {insights.demandObservations && insights.demandObservations.length > 0 ? (
                    <ul className="space-y-2 text-xs text-slate-300">
                      {insights.demandObservations.map((obs, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-2 rounded-xl bg-slate-900/60 border border-slate-800 p-2.5"
                        >
                          <span className="text-cyan-400 font-bold shrink-0">•</span>
                          <span className="leading-relaxed">{obs}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Demand evenly distributed across sections.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Actionable Utilization Recommendations */}
            {insights.recommendations && insights.recommendations.length > 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Recommended Actions for Gym Staff
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {insights.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-slate-300 flex items-start space-x-2.5"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
