'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Equipment, EquipmentStats, EquipmentStatus, EquipmentInsert } from '@/types/equipment';
import {
  getStoredEquipment,
  addEquipment as storageAdd,
  updateEquipment as storageUpdate,
  updateEquipmentStatus as storageUpdateStatus,
  deleteEquipment as storageDelete,
  resetToDefaultEquipment as storageReset,
  getStoredAdminStatus,
  setStoredAdminStatus,
  EQUIPMENT_CHANGE_EVENT,
} from '@/lib/storage';

interface EquipmentContextType {
  equipment: Equipment[];
  stats: EquipmentStats;
  isLoading: boolean;
  isAdmin: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  addEquipment: (data: EquipmentInsert) => Equipment;
  updateEquipment: (id: string, updates: Partial<EquipmentInsert>) => Equipment | null;
  updateStatus: (id: string, status: EquipmentStatus) => Equipment | null;
  deleteEquipment: (id: string) => boolean;
  resetToDefault: () => void;
  refreshEquipment: () => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

// Admin PIN/password for quick local admin authentication
export const ADMIN_PASSCODE = 'admin123';

export function EquipmentProvider({ children }: { children: React.ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadData = () => {
    const items = getStoredEquipment();
    setEquipment(items);
    setIsAdmin(getStoredAdminStatus());
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();

    // Listen to changes in the current tab or other browser tabs
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener(EQUIPMENT_CHANGE_EVENT, handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(EQUIPMENT_CHANGE_EVENT, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Compute metrics dynamically from persistent equipment array
  const stats = useMemo<EquipmentStats>(() => {
    const total = equipment.length;
    const available = equipment.filter((e) => e.status === 'available').length;
    const inUse = equipment.filter((e) => e.status === 'in_use').length;
    const maintenance = equipment.filter((e) => e.status === 'maintenance').length;
    const outOfService = equipment.filter((e) => e.status === 'out_of_service').length;
    const availabilityRate = total > 0 ? Math.round((available / total) * 100) : 0;

    return {
      total,
      available,
      inUse,
      maintenance,
      outOfService,
      availabilityRate,
    };
  }, [equipment]);

  const loginAdmin = (pin: string): boolean => {
    if (pin.trim() === ADMIN_PASSCODE) {
      setStoredAdminStatus(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setStoredAdminStatus(false);
    setIsAdmin(false);
  };

  const handleAdd = (data: EquipmentInsert): Equipment => {
    const created = storageAdd(data);
    loadData();
    return created;
  };

  const handleUpdate = (
    id: string,
    updates: Partial<EquipmentInsert>
  ): Equipment | null => {
    const updated = storageUpdate(id, updates);
    loadData();
    return updated;
  };

  const handleUpdateStatus = (id: string, status: EquipmentStatus): Equipment | null => {
    const updated = storageUpdateStatus(id, status);
    loadData();
    return updated;
  };

  const handleDelete = (id: string): boolean => {
    const deleted = storageDelete(id);
    loadData();
    return deleted;
  };

  const handleReset = () => {
    storageReset();
    loadData();
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        stats,
        isLoading,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        addEquipment: handleAdd,
        updateEquipment: handleUpdate,
        updateStatus: handleUpdateStatus,
        deleteEquipment: handleDelete,
        resetToDefault: handleReset,
        refreshEquipment: loadData,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
}
