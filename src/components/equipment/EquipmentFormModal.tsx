'use client';

import React, { useState, useEffect } from 'react';
import { X, Dumbbell, AlertCircle, Save } from 'lucide-react';
import { Equipment, EquipmentCategory, EquipmentStatus, EquipmentInsert } from '@/types/equipment';
import { useEquipment } from '@/context/EquipmentContext';

interface EquipmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentToEdit: Equipment | null;
}

export function EquipmentFormModal({
  isOpen,
  onClose,
  equipmentToEdit,
}: EquipmentFormModalProps) {
  const { addEquipment, updateEquipment } = useEquipment();

  const [formData, setFormData] = useState<EquipmentInsert>({
    name: '',
    category: 'Strength',
    location: '',
    status: 'available',
    description: '',
    image_url: '',
    last_maintained_at: new Date().toISOString(),
    maintenance_notes: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (equipmentToEdit) {
      setFormData({
        name: equipmentToEdit.name,
        category: equipmentToEdit.category,
        location: equipmentToEdit.location,
        status: equipmentToEdit.status,
        description: equipmentToEdit.description || '',
        image_url: equipmentToEdit.image_url || '',
        last_maintained_at: equipmentToEdit.last_maintained_at || new Date().toISOString(),
        maintenance_notes: equipmentToEdit.maintenance_notes || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Strength',
        location: '',
        status: 'available',
        description: '',
        image_url: '',
        last_maintained_at: new Date().toISOString(),
        maintenance_notes: '',
      });
    }
    setError('');
  }, [equipmentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Equipment name is required.');
      return;
    }

    if (!formData.location.trim()) {
      setError('Gym location or bay is required.');
      return;
    }

    // Default fallback image if none provided
    const finalData: EquipmentInsert = {
      ...formData,
      image_url:
        formData.image_url?.trim() ||
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    };

    if (equipmentToEdit) {
      updateEquipment(equipmentToEdit.id, finalData);
    } else {
      addEquipment(finalData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl scrollbar-thin scrollbar-thumb-slate-700">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {equipmentToEdit ? 'Edit Equipment Details' : 'Add New Gym Equipment'}
            </h3>
            <p className="text-xs text-slate-400">
              {equipmentToEdit
                ? 'Update machine status, location, or maintenance history'
                : 'Register a new equipment unit into the gym inventory'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center space-x-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Equipment Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Equipment Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. LifeFitness Commercial Treadmill 95T"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as EquipmentCategory,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength</option>
                <option value="Free Weights">Free Weights</option>
                <option value="Functional">Functional</option>
                <option value="Recovery">Recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as EquipmentStatus,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="available">🟢 Available</option>
                <option value="in_use">🟡 In Use</option>
                <option value="maintenance">🟠 Maintenance</option>
                <option value="out_of_service">🔴 Out of Service</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Gym Location / Zone *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Ground Floor - Cardio Bay 3"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Technical specs, resistance levels, or instructions..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Maintenance Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Maintenance Notes
            </label>
            <textarea
              rows={2}
              value={formData.maintenance_notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, maintenance_notes: e.target.value })
              }
              placeholder="Recent servicing, wear notes, parts needed..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500"
            >
              <Save className="h-4 w-4" />
              <span>{equipmentToEdit ? 'Save Changes' : 'Create Equipment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
