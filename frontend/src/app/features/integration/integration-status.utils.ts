export type IntegrationStatus = 'connected' | 'disconnected' | 'error';

export const INTEGRATION_STATUS_COLORS: Record<IntegrationStatus, string> = {
  connected: '#2e7d32',
  disconnected: '#757575',
  error: '#d32f2f'
};

export const INTEGRATION_STATUS_ICONS: Record<IntegrationStatus, string> = {
  connected: 'check_circle',
  disconnected: 'pause_circle',
  error: 'error'
};

export const INTEGRATION_STATUS_LABELS: Record<IntegrationStatus, string> = {
  connected: 'Połączony',
  disconnected: 'Rozłączony',
  error: 'Błąd'
};

export function getIntegrationStatusColor(status: IntegrationStatus): string {
  return INTEGRATION_STATUS_COLORS[status] || '#757575';
}

export function getIntegrationStatusIcon(status: IntegrationStatus): string {
  return INTEGRATION_STATUS_ICONS[status] || 'help';
}

export function getIntegrationStatusLabel(status: IntegrationStatus): string {
  return INTEGRATION_STATUS_LABELS[status] || status;
}
