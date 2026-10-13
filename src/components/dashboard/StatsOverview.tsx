'use client';

import React from 'react';
import {
  Dumbbell,
  CheckCircle2,
  Clock,
  Wrench,
  Percent,
} from 'lucide-react';
import { useEquipment } from '@/context/EquipmentContext';

export function StatsOverview() {
  const { stats } = useEquipment();

  const cards = [
    {
      title: 'Total Equipment',
      value: stats.total,
      description: 'Tracked gym machines & stations',
      icon: Dumbbell,
      accentColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      pillColor: 'bg-indigo-500/20 text-indigo-300',
    },
    {
      title: 'Available Now',
      value: stats.available,
      description: 'Ready for immediate student use',
      icon: CheckCircle2,
      accentColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      pillColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      title: 'Currently In Use',
      value: stats.inUse,
      description: 'Occupied by working-out members',
      icon: Clock,
      accentColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      pillColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      title: 'Under Maintenance',
      value: stats.maintenance + stats.outOfService,
      description: `${stats.maintenance} servicing, ${stats.outOfService} out of order`,
      icon: Wrench,
      accentColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      pillColor: 'bg-rose-500/20 text-rose-300',
    },
    {
      title: 'Availability Rate',
      value: `${stats.availabilityRate}%`,
      description: 'Capacity ready for workouts',
      icon: Percent,
      accentColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      pillColor: 'bg-cyan-500/20 text-cyan-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-slate-900/70 p-5 backdrop-blur-sm transition-all hover:bg-slate-900/90 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.bgColor} ${card.accentColor}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {card.value}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-400 leading-relaxed truncate">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
