import { ClientStatus } from './client.model';

const clientStatusLabels: Record<ClientStatus, string> = {
  active: 'Aktywny',
  inactive: 'Nieaktywny',
  lead: 'Potencjalny',
  former: 'Były'
};

const clientStatusClasses: Record<ClientStatus, string> = {
  active: 'status-active',
  inactive: 'status-inactive',
  lead: 'status-lead',
  former: 'status-former'
};

const documentTypeIcons: Record<string, string> = {
  contract: 'description',
  annex: 'note_add',
  specification: 'science',
  protocol: 'assignment',
  other: 'insert_drive_file'
};

export function getClientStatusLabel(status: ClientStatus): string {
  return clientStatusLabels[status] || status;
}

export function getClientStatusClass(status: ClientStatus): string {
  return clientStatusClasses[status] || '';
}

export function getDocumentTypeIcon(type: string): string {
  return documentTypeIcons[type] || 'description';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
