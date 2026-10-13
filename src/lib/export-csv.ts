import { Equipment } from '@/types/equipment';

export function exportEquipmentToCSV(equipmentList: Equipment[], filenamePrefix = 'gym-equipment-status'): void {
  if (!equipmentList || equipmentList.length === 0) {
    alert('No equipment data available to export.');
    return;
  }

  const headers = [
    'Equipment ID',
    'Name',
    'Category',
    'Location',
    'Current Status',
    'Last Maintained At',
    'Maintenance Notes',
    'Created At',
  ];

  const escapeCSV = (value: string | null | undefined): string => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const rows = equipmentList.map((item) => [
    escapeCSV(item.id),
    escapeCSV(item.name),
    escapeCSV(item.category),
    escapeCSV(item.location),
    escapeCSV(item.status),
    escapeCSV(item.last_maintained_at ? new Date(item.last_maintained_at).toLocaleDateString() : 'N/A'),
    escapeCSV(item.maintenance_notes || 'None'),
    escapeCSV(new Date(item.created_at).toLocaleDateString()),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}-${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
