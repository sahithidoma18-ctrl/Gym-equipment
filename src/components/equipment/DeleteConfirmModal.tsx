'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Equipment } from '@/types/equipment';
import { useEquipment } from '@/context/EquipmentContext';

interface DeleteConfirmModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteConfirmModal({
  equipment,
  isOpen,
  onClose,
}: DeleteConfirmModalProps) {
  const { deleteEquipment } = useEquipment();

  if (!isOpen || !equipment) return null;

  const handleConfirm = () => {
    deleteEquipment(equipment.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Equipment?</h3>
            <p className="text-xs text-slate-400">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Are you sure you want to permanently remove{' '}
          <strong className="text-white font-semibold">&quot;{equipment.name}&quot;</strong> located at{' '}
          <span className="text-slate-400">({equipment.location})</span>?
        </p>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center space-x-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500"
          >
            <Trash2 className="h-4 w-4" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
