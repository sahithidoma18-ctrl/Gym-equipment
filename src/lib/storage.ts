import { Equipment, EquipmentStatus } from '@/types/equipment';
import { INITIAL_EQUIPMENT } from './initial-data';

export const EQUIPMENT_STORAGE_KEY = 'gym_equipment_inventory_v1';
export const ADMIN_STORAGE_KEY = 'gym_admin_auth_v1';
export const EQUIPMENT_CHANGE_EVENT = 'gym-equipment-updated';

// Helper to notify other components/tabs of changes
export function dispatchEquipmentChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EQUIPMENT_CHANGE_EVENT));
  }
}

// Retrieve equipment from localStorage (fallback to INITIAL_EQUIPMENT)
export function getStoredEquipment(): Equipment[] {
  if (typeof window === 'undefined') {
    return INITIAL_EQUIPMENT;
  }

  try {
    const raw = localStorage.getItem(EQUIPMENT_STORAGE_KEY);
    if (!raw) {
      // First time loading - initialize with seed data
      localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(INITIAL_EQUIPMENT));
      return INITIAL_EQUIPMENT;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_EQUIPMENT;
  } catch (error) {
    console.error('Error reading equipment from localStorage:', error);
    return INITIAL_EQUIPMENT;
  }
}

// Save equipment list into localStorage
export function saveEquipment(items: Equipment[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(items));
    dispatchEquipmentChange();
  } catch (error) {
    console.error('Error saving equipment to localStorage:', error);
  }
}

// Add a new equipment item
export function addEquipment(
  data: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>
): Equipment {
  const current = getStoredEquipment();
  const now = new Date().toISOString();
  const newEquipment: Equipment = {
    ...data,
    id: `eq-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    created_at: now,
    updated_at: now,
  };

  const updatedList = [newEquipment, ...current];
  saveEquipment(updatedList);
  return newEquipment;
}

// Update existing equipment
export function updateEquipment(
  id: string,
  updates: Partial<Omit<Equipment, 'id' | 'created_at'>>
): Equipment | null {
  const current = getStoredEquipment();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updatedItem: Equipment = {
    ...current[index],
    ...updates,
    updated_at: now,
  };

  current[index] = updatedItem;
  saveEquipment([...current]);
  return updatedItem;
}

// Quick status toggle
export function updateEquipmentStatus(id: string, status: EquipmentStatus): Equipment | null {
  return updateEquipment(id, { status });
}

// Delete equipment
export function deleteEquipment(id: string): boolean {
  const current = getStoredEquipment();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length === current.length) return false;

  saveEquipment(filtered);
  return true;
}

// Reset to initial seed equipment
export function resetToDefaultEquipment(): Equipment[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(INITIAL_EQUIPMENT));
    dispatchEquipmentChange();
  }
  return INITIAL_EQUIPMENT;
}

// Admin Authentication State in localStorage
export function getStoredAdminStatus(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
}

export function setStoredAdminStatus(isAdmin: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_STORAGE_KEY, isAdmin ? 'true' : 'false');
  dispatchEquipmentChange();
}
