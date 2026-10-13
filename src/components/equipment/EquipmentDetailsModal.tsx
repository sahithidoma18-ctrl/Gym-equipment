'use client';

import React from 'react';
import {
  X,
  MapPin,
  Calendar,
  Wrench,
  Clock,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Equipment, EquipmentStatus } from '@/types/equipment';
import { useEquipment } from '@/context/EquipmentContext';

interface EquipmentDetailsModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentDetailsModal({
  equipment,
  isOpen,
  onClose,
}: EquipmentDetailsModalProps) {
  const { isAdmin, updateStatus } = useEquipment();

  if (!isOpen || !equipment) return null;

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'available':
        return {
          label: 'Available For Use',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          icon: CheckCircle2,
        };
      case 'in_use':
        return {
          label: 'Currently In Use',
          className: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          icon: Clock,
        };
      case 'maintenance':
        return {
          label: 'Under Maintenance',
          className: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          icon: Wrench,
        };
      case 'out_of_service':
        return {
          label: 'Out of Service',
          className: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          icon: AlertOctagon,
        };
      default:
        return {
          label: status,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
          icon: AlertTriangle,
        };
    }
  };

  const statusConfig = getStatusBadge(equipment.status);
  const StatusIcon = statusConfig.icon;

  const fallbackImage =
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl scrollbar-thin scrollbar-thumb-slate-700">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-slate-950/70 p-2 text-slate-400 hover:text-white backdrop-blur-md"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Machine Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
          <img
            src={equipment.image_url || fallbackImage}
            alt={equipment.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          {/* Status Badge in Header */}
          <div className="absolute bottom-4 left-6 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-slate-950/90 border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200">
              {equipment.category}
            </span>
            <div
              className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1 text-xs font-semibold backdrop-blur-md ${statusConfig.className}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{statusConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Details Container */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white">{equipment.name}</h2>
            <div className="mt-2 flex items-center space-x-2 text-sm text-slate-300">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{equipment.location}</span>
            </div>
          </div>

          {/* Description */}
          {equipment.description && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1.5">
                <Info className="h-3.5 w-3.5 text-cyan-400" />
                <span>Equipment Overview & Specifications</span>
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {equipment.description}
              </p>
            </div>
          )}

          {/* Maintenance & Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-2">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                <span>Last Maintained</span>
              </span>
              <p className="text-sm font-medium text-white">
                {equipment.last_maintained_at
                  ? new Date(equipment.last_maintained_at).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'No scheduled service on record'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-2">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Registered At</span>
              </span>
              <p className="text-sm font-medium text-white">
                {new Date(equipment.created_at).toLocaleDateString('en-US', {
                  dateStyle: 'medium',
                })}
              </p>
            </div>
          </div>

          {/* Maintenance Notes */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <Wrench className="h-3.5 w-3.5 text-amber-400" />
              <span>Maintenance Records & Inspection Notes</span>
            </h4>
            <p className="text-sm text-slate-300 italic">
              {equipment.maintenance_notes ||
                'No recorded issues or scheduled repairs for this unit.'}
            </p>
          </div>

          {/* Admin Status Toggle in Details Modal */}
          {isAdmin && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Admin Status Control
                </h5>
                <p className="text-xs text-slate-400">
                  Quickly change live machine availability
                </p>
              </div>
              <select
                value={equipment.status}
                onChange={(e) => {
                  updateStatus(equipment.id, e.target.value as EquipmentStatus);
                  equipment.status = e.target.value as EquipmentStatus;
                }}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white focus:outline-none"
              >
                <option value="available">🟢 Set Available</option>
                <option value="in_use">🟡 Set In Use</option>
                <option value="maintenance">🟠 Set Maintenance</option>
                <option value="out_of_service">🔴 Set Out of Service</option>
              </select>
            </div>
          )}

          {/* Close button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 text-xs font-medium text-white hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
