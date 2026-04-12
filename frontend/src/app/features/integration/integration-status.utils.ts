export type IntegrationStatus = 'connected' | 'disconnected' | 'error';

const integrationStatusColors: Record<IntegrationStatus, string> = {
  connected: '#2e7d32',
  disconnected: '#757575',
  error: '#d32f2f'
};

const integrationStatusIcons: Record<IntegrationStatus, string> = {
  connected: 'check_circle',
  disconnected: 'pause_circle',
  error: 'error'
};

const integrationStatusLabels: Record<IntegrationStatus, string> = {
  connected: 'Połączony',
  disconnected: 'Rozłączony',
  error: 'Błąd'
};

export function getIntegrationStatusColor(status: IntegrationStatus): string {
  return integrationStatusColors[status] || '#757575';
}

export function getIntegrationStatusIcon(status: IntegrationStatus): string {
  return integrationStatusIcons[status] || 'help';
}

export function getIntegrationStatusLabel(status: IntegrationStatus): string {
  return integrationStatusLabels[status] || status;
}
