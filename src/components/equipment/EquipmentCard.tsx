'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';
import { Equipment, EquipmentStatus } from '@/types/equipment';
import { useEquipment } from '@/context/EquipmentContext';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: (equipment: Equipment) => void;
  onDelete: (equipment: Equipment) => void;
  onViewDetails: (equipment: Equipment) => void;
}

export function EquipmentCard({
  equipment,
  onEdit,
  onDelete,
  onViewDetails,
}: EquipmentCardProps) {
  const { isAdmin, updateStatus } = useEquipment();
  const [imgError, setImgError] = useState(false);

  const getStatusConfig = (status: EquipmentStatus) => {
    switch (status) {
      case 'available':
        return {
          label: 'Available',
          badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dotClass: 'bg-emerald-400',
          icon: CheckCircle2,
        };
      case 'in_use':
        return {
          label: 'In Use',
          badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dotClass: 'bg-amber-400',
          icon: Clock,
        };
      case 'maintenance':
        return {
          label: 'Maintenance',
          badgeClass: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
          dotClass: 'bg-orange-400',
          icon: Wrench,
        };
      case 'out_of_service':
        return {
          label: 'Out of Service',
          badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          dotClass: 'bg-rose-400',
          icon: AlertOctagon,
        };
      default:
        return {
          label: status,
          badgeClass: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
          dotClass: 'bg-slate-400',
          icon: AlertTriangle,
        };
    }
  };

  const statusConfig = getStatusConfig(equipment.status);
  const StatusIcon = statusConfig.icon;

  const fallbackImage =
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-black/40">
      {/* Top Image & Category Tag */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={imgError || !equipment.image_url ? fallbackImage : equipment.image_url}
            alt={equipment.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Category Tag */}
          <span className="absolute top-3 left-3 rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-slate-200 border border-slate-700/60">
            {equipment.category}
          </span>

          {/* Status Badge */}
          <div
            className={`absolute top-3 right-3 flex items-center space-x-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border backdrop-blur-md ${statusConfig.badgeClass}`}
          >
            <StatusIcon className="h-3 w-3" />
            <span>{statusConfig.label}</span>
          </div>

          {/* Location Bar at bottom of image */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center space-x-1 text-xs text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{equipment.location}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          <h4 className="text-base font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {equipment.name}
          </h4>

          {equipment.description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {equipment.description}
            </p>
          )}

          {/* Maintenance Snippet */}
          {equipment.maintenance_notes && (
            <div className="mt-3 rounded-lg bg-slate-950/60 border border-slate-800/80 p-2 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Notes: </span>
              <span className="truncate block">{equipment.maintenance_notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Controls & Quick Status Change */}
      <div className="border-t border-slate-800/80 bg-slate-950/40 p-3 flex items-center justify-between gap-2">
        {/* Admin Quick Status Selector */}
        {isAdmin ? (
          <div className="flex items-center space-x-1.5 w-full">
            <select
              value={equipment.status}
              onChange={(e) =>
                updateStatus(equipment.id, e.target.value as EquipmentStatus)
              }
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-medium text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="available">🟢 Available</option>
              <option value="in_use">🟡 In Use</option>
              <option value="maintenance">🟠 Maintenance</option>
              <option value="out_of_service">🔴 Out of Service</option>
            </select>

            <button
              onClick={() => onEdit(equipment)}
              className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
              title="Edit Details"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(equipment)}
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20"
              title="Delete Equipment"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-slate-500">
              {equipment.last_maintained_at
                ? `Maintained ${new Date(equipment.last_maintained_at).toLocaleDateString()}`
                : 'Routine check up-to-date'}
            </span>
            <button
              onClick={() => onViewDetails(equipment)}
              className="flex items-center space-x-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Eye className="h-3 w-3" />
              <span>Details</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
