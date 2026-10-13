'use client';

import React, { useState, useMemo } from 'react';
import { useEquipment } from '@/context/EquipmentContext';
import { Equipment, EquipmentStatus } from '@/types/equipment';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { StatusCharts } from '@/components/dashboard/StatusCharts';
import { AIInsightsPanel } from '@/components/ai/AIInsightsPanel';
import { EquipmentFilter, FilterState } from '@/components/equipment/EquipmentFilter';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { EquipmentFormModal } from '@/components/equipment/EquipmentFormModal';
import { EquipmentDetailsModal } from '@/components/equipment/EquipmentDetailsModal';
import { DeleteConfirmModal } from '@/components/equipment/DeleteConfirmModal';
import { exportEquipmentToCSV } from '@/lib/export-csv';
import { SearchX, Activity, Plus } from 'lucide-react';

export default function HomePage() {
  const { equipment, isLoading, isAdmin } = useEquipment();

  // Filter & Search State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    status: 'All',
    sortBy: 'name-asc',
  });

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState<Equipment | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null);

  // Filter & Sort Logic
  const filteredEquipment = useMemo(() => {
    return equipment
      .filter((item) => {
        // Search filter (name or location)
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchName = item.name.toLowerCase().includes(query);
          const matchLoc = item.location.toLowerCase().includes(query);
          const matchNotes = (item.maintenance_notes || '').toLowerCase().includes(query);
          if (!matchName && !matchLoc && !matchNotes) return false;
        }

        // Category filter
        if (filters.category !== 'All' && item.category !== filters.category) {
          return false;
        }

        // Status filter
        if (filters.status !== 'All' && item.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (filters.sortBy === 'name-desc') {
          return b.name.localeCompare(a.name);
        }
        if (filters.sortBy === 'status') {
          const statusOrder: Record<EquipmentStatus, number> = {
            available: 1,
            in_use: 2,
            maintenance: 3,
            out_of_service: 4,
          };
          return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        }
        if (filters.sortBy === 'updated') {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        return 0;
      });
  }, [equipment, filters]);

  // Handlers
  const handleOpenAdd = () => {
    setEquipmentToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (item: Equipment) => {
    setEquipmentToEdit(item);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (item: Equipment) => {
    setEquipmentToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetails = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsDetailsModalOpen(true);
  };

  const handleExportCSV = () => {
    exportEquipmentToCSV(filteredEquipment, 'gym-equipment-availability');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Live Campus Gym Facility Monitor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Gym Equipment <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Availability Checker
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate guesswork before your workout. Check live machine availability, report maintenance needs, and explore Google Gemini AI insights on gym equipment health and capacity.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* 2. Key Metrics Overview */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Live Operational Metrics
        </h2>
        <StatsOverview />
      </section>

      {/* 3. Status & Category Distribution Charts */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Data Visualizations & Analytics
        </h2>
        <StatusCharts />
      </section>

      {/* 4. AI-Powered Insights Panel */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Artificial Intelligence Intelligence
        </h2>
        <AIInsightsPanel />
      </section>

      {/* 5. Equipment Catalog & Filtering */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Gym Equipment Catalog
            </h2>
            <p className="text-xs text-slate-400">
              Browse, filter by workout category, inspect maintenance history, or update availability
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <EquipmentFilter
          filters={filters}
          onFilterChange={setFilters}
          onOpenAddModal={handleOpenAdd}
          onExportCSV={handleExportCSV}
          filteredCount={filteredEquipment.length}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-emerald-500" />
            <p className="text-sm text-slate-400">Loading equipment inventory...</p>
          </div>
        ) : filteredEquipment.length === 0 ? (
          /* Empty Search / Filter State */
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400 mb-4 border border-slate-700">
              <SearchX className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-white">No Equipment Found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              No gym equipment matched your search or filter criteria. Try adjusting your query or reset the filters.
            </p>
            <div className="mt-5 flex items-center space-x-3">
              <button
                onClick={() =>
                  setFilters({
                    search: '',
                    category: 'All',
                    status: 'All',
                    sortBy: 'name-asc',
                  })
                }
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white"
              >
                Clear All Filters
              </button>
              {isAdmin && (
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Equipment</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Equipment Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onViewDetails={handleOpenDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <EquipmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        equipmentToEdit={equipmentToEdit}
      />

      <EquipmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        equipment={selectedEquipment}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        equipment={equipmentToDelete}
      />
    </div>
  );
}
