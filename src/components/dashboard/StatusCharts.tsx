'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useEquipment } from '@/context/EquipmentContext';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  Available: '#10B981', // emerald-500
  'In Use': '#F59E0B', // amber-500
  Maintenance: '#F97316', // orange-500
  'Out of Service': '#EF4444', // red-500
};

export function StatusCharts() {
  const { equipment, stats } = useEquipment();

  // Status Distribution Data for Donut Chart
  const statusData = [
    { name: 'Available', value: stats.available },
    { name: 'In Use', value: stats.inUse },
    { name: 'Maintenance', value: stats.maintenance },
    { name: 'Out of Service', value: stats.outOfService },
  ].filter((item) => item.value > 0);

  // Category Distribution Data for Bar Chart
  const categoryMap: Record<string, { total: number; available: number }> = {};
  equipment.forEach((item) => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = { total: 0, available: 0 };
    }
    categoryMap[item.category].total += 1;
    if (item.status === 'available') {
      categoryMap[item.category].available += 1;
    }
  });

  const categoryData = Object.entries(categoryMap).map(([cat, counts]) => ({
    category: cat,
    total: counts.total,
    available: counts.available,
  }));

  if (equipment.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Equipment Status Distribution (Donut Chart) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <PieIcon className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Status Distribution</h3>
          </div>
          <span className="text-xs text-slate-400">Live Machine States</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={STATUS_COLORS[entry.name] || '#64748B'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#F8FAFC',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {statusData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2 text-xs text-slate-300">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[item.name] }}
              />
              <span>
                {item.name}: <strong className="text-white">{item.value}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Category Breakdown (Bar Chart) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Equipment by Category</h3>
          </div>
          <span className="text-xs text-slate-400">Inventory Allocation</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                axisLine={{ stroke: '#334155' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#F8FAFC',
                }}
              />
              <Bar dataKey="total" name="Total Equipment" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="available" name="Available Now" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
            <span>Total Units</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            <span>Available Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
