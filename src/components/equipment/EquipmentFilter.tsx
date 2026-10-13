'use client';

import React from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  X,
} from 'lucide-react';
import { EquipmentCategory, EquipmentStatus } from '@/types/equipment';
import { useEquipment } from '@/context/EquipmentContext';

export interface FilterState {
  search: string;
  category: 'All' | EquipmentCategory;
  status: 'All' | EquipmentStatus;
  sortBy: 'name-asc' | 'name-desc' | 'status' | 'updated';
}

interface EquipmentFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
  filteredCount: number;
}

const CATEGORIES: Array<'All' | EquipmentCategory> = [
  'All',
  'Cardio',
  'Strength',
  'Free Weights',
  'Functional',
  'Recovery',
];

export function EquipmentFilter({
  filters,
  onFilterChange,
  onOpenAddModal,
  onExportCSV,
  filteredCount,
}: EquipmentFilterProps) {
  const { isAdmin, equipment } = useEquipment();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (category: 'All' | EquipmentCategory) => {
    onFilterChange({ ...filters, category });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      status: e.target.value as 'All' | EquipmentStatus,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as FilterState['sortBy'],
    });
  };

  const clearSearch = () => {
    onFilterChange({ ...filters, search: '' });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
      {/* Top Controls Row: Search & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search equipment by machine name, location, or bay..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-9 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Buttons: Status Select, Sort, Export, Add */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown Filter */}
          <div className="flex items-center space-x-1 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-300">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="available" className="bg-slate-900">🟢 Available</option>
              <option value="in_use" className="bg-slate-900">🟡 In Use</option>
              <option value="maintenance" className="bg-slate-900">🟠 Maintenance</option>
              <option value="out_of_service" className="bg-slate-900">🔴 Out of Service</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="name-asc" className="bg-slate-900">Name (A → Z)</option>
              <option value="name-desc" className="bg-slate-900">Name (Z → A)</option>
              <option value="status" className="bg-slate-900">Status Priority</option>
              <option value="updated" className="bg-slate-900">Recently Updated</option>
            </select>
          </div>

          {/* Export to CSV */}
          <button
            onClick={onExportCSV}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            title="Download CSV equipment report"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Add Equipment (Admin Only) */}
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500"
            >
              <Plus className="h-4 w-4" />
              <span>Add Equipment</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? equipment.length
                : equipment.filter((e) => e.category === cat).length;
            const isSelected = filters.category === cat;

            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950/70 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected
                      ? 'bg-slate-950/20 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredCount}</strong> machine{filteredCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
