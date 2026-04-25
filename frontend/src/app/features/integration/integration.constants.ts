import { Integration } from './integration.model';

export const INTEGRATION_TYPES = {
  EMAIL: 'email' as const,
  CALENDAR: 'calendar' as const,
  MESSENGER: 'messenger' as const,
  API: 'api' as const
} as const;

export const INTEGRATION_TYPE_ICONS: Record<Integration['type'], string> = {
  email: 'email',
  calendar: 'calendar_month',
  messenger: 'chat',
  api: 'api'
};

export const INTEGRATION_TYPE_LABELS: Record<Integration['type'], string> = {
  email: 'Email',
  calendar: 'Kalendarz',
  messenger: 'Komunikator',
  api: 'API'
};
