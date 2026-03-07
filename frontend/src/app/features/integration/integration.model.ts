export type IntegrationType = 'email' | 'calendar' | 'messenger' | 'api';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error';

export interface BaseIntegration {
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailIntegration extends BaseIntegration {
  type: 'email';
  config: {
    imapHost: string;
    imapPort: number;
    smtpHost: string;
    smtpPort: number;
    username: string;
    password?: string; // nigdy nie zwracane z backendu w pełnej formie
    useSSL: boolean;
    folder: string; // np. INBOX
  };
}

export interface CalendarIntegration extends BaseIntegration {
  type: 'calendar';
  provider: 'google' | 'outlook' | 'other';
  config: {
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
    calendarId?: string; // domyślny kalendarz
    syncInterval: number; // w minutach
  };
}

export interface MessengerIntegration extends BaseIntegration {
  type: 'messenger';
  provider: 'slack' | 'teams' | 'discord';
  config: {
    webhookUrl: string;
    channel?: string;
    notifyOn: string[]; // typy zdarzeń do powiadomień
  };
}

export interface ApiIntegration extends BaseIntegration {
  type: 'api';
  config: {
    apiKeys: ApiKey[];
    rateLimit?: number;
    allowedIps?: string[];
  };
}

export interface ApiKey {
  id: string;
  name: string;
  key: string; // masked in UI
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
}

// Suma typów
export type Integration = EmailIntegration | CalendarIntegration | MessengerIntegration | ApiIntegration;