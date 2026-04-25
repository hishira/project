import { Injectable, signal } from '@angular/core';
import { Integration } from './integration.model';
import { MOCK_INTEGRATIONS } from './integration-mock-data';

@Injectable({ providedIn: 'root' })
export class IntegrationService {
  readonly integrations = signal<Integration[]>(MOCK_INTEGRATIONS);

  getIntegrationById(id: string): Integration | undefined {
    return this.integrations().find(i => i.id === id);
  }

  getIntegrationsByType(type: Integration['type']): Integration[] {
    return this.integrations().filter(i => i.type === type);
  }

  // Symulacja akcji
  testConnection(id: string): void {
    console.log('Testowanie połączenia dla integracji:', id);
  }

  saveIntegration(id: string, config: unknown): void {
    console.log('Zapisywanie konfiguracji integracji:', id, config);
  }

  deleteIntegration(id: string): void {
    console.log('Usuwanie integracji:', id);
  }

  generateApiKey(integrationId: string, name: string): void {
    console.log('Generowanie nowego klucza API dla:', integrationId, name);
  }

  revokeApiKey(integrationId: string, keyId: string): void {
    console.log('Unieważnianie klucza API:', keyId);
  }
}