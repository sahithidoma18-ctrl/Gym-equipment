export type EquipmentStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service';

export type EquipmentCategory = 'Cardio' | 'Strength' | 'Free Weights' | 'Functional' | 'Recovery';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string | null;
  image_url: string | null;
  location: string;
  status: EquipmentStatus;
  last_maintained_at: string | null;
  maintenance_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type EquipmentInsert = Omit<Equipment, 'id' | 'created_at' | 'updated_at'>;
export type EquipmentUpdate = Partial<EquipmentInsert>;

export interface EquipmentStats {
  total: number;
  available: number;
  inUse: number;
  maintenance: number;
  outOfService: number;
  availabilityRate: number; // percentage (0 - 100)
}

export interface AIInsightResponse {
  summary: string;
  maintenancePriorities: Array<{
    equipmentName: string;
    urgency: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  demandObservations: string[];
  recommendations: string[];
  timestamp: string;
}
