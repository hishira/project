import { Injectable, signal } from '@angular/core';
import { Integration, EmailIntegration, CalendarIntegration, MessengerIntegration, ApiIntegration } from './integration.model';

@Injectable({ providedIn: 'root' })
export class IntegrationService {
  private integrationsData: Integration[] = [
    {
      id: 'int1',
      name: 'Poczta firmowa',
      type: 'email',
      status: 'connected',
      enabled: true,
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-02-20'),
      config: {
        imapHost: 'imap.firma.pl',
        imapPort: 993,
        smtpHost: 'smtp.firma.pl',
        smtpPort: 587,
        username: 'crm@firma.pl',
        useSSL: true,
        folder: 'INBOX'
      }
    } as EmailIntegration,
    {
      id: 'int2',
      name: 'Kalendarz Google',
      type: 'calendar',
      status: 'connected',
      enabled: true,
      createdAt: new Date('2025-01-20'),
      updatedAt: new Date('2025-03-01'),
      provider: 'google',
      config: {
        clientId: '1234567890-abc123.apps.googleusercontent.com',
        redirectUri: 'https://crm.firma.pl/auth/google',
        syncInterval: 15,
        calendarId: 'primary'
      }
    } as CalendarIntegration,
    {
      id: 'int3',
      name: 'Slack – powiadomienia',
      type: 'messenger',
      status: 'connected',
      enabled: true,
      createdAt: new Date('2025-02-05'),
      updatedAt: new Date('2025-02-05'),
      provider: 'slack',
      config: {
        webhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        channel: '#crm-alerts',
        notifyOn: ['new_ticket', 'task_assigned', 'meeting_reminder']
      }
    } as MessengerIntegration,
    {
      id: 'int4',
      name: 'API dla programistów',
      type: 'api',
      status: 'connected',
      enabled: true,
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-03-10'),
      config: {
        apiKeys: [
          {
            id: 'key1',
            name: 'Klucz produkcyjny',
            key: 'sk_live_••••••••••••••••',
            createdAt: new Date('2025-01-10'),
            lastUsed: new Date('2025-03-09'),
            expiresAt: new Date('2026-01-10')
          },
          {
            id: 'key2',
            name: 'Klucz testowy',
            key: 'sk_test_••••••••••••••••',
            createdAt: new Date('2025-01-10'),
            lastUsed: new Date('2025-03-08')
          }
        ],
        rateLimit: 1000
      }
    } as ApiIntegration,
    {
      id: 'int5',
      name: 'Microsoft Teams',
      type: 'messenger',
      status: 'disconnected',
      enabled: false,
      createdAt: new Date('2025-02-15'),
      updatedAt: new Date('2025-02-15'),
      provider: 'teams',
      config: {
        webhookUrl: '',
        notifyOn: []
      }
    } as MessengerIntegration
  ];

  readonly integrations = signal<Integration[]>(this.integrationsData);

  getIntegrationById(id: string): Integration | undefined {
    return this.integrations().find(i => i.id === id);
  }

  getIntegrationsByType(type: Integration['type']): Integration[] {
    return this.integrations().filter(i => i.type === type);
  }

  // Symulacja akcji
  testConnection(id: string) {
    console.log('Testowanie połączenia dla integracji:', id);
  }

  saveIntegration(id: string, config: any) {
    console.log('Zapisywanie konfiguracji integracji:', id, config);
  }

  deleteIntegration(id: string) {
    console.log('Usuwanie integracji:', id);
  }

  generateApiKey(integrationId: string, name: string) {
    console.log('Generowanie nowego klucza API dla:', integrationId, name);
  }

  revokeApiKey(integrationId: string, keyId: string) {
    console.log('Unieważnianie klucza API:', keyId);
  }
}