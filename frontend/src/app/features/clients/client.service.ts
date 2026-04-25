import { Injectable, signal } from '@angular/core';
import { Client } from './client.model';
import { MOCK_CLIENTS } from './client-mock-data';

@Injectable({ providedIn: 'root' })
export class ClientService {
    readonly clients = signal<Client[]>(MOCK_CLIENTS);

    getClientById(id: string): Client | undefined {
        return this.clients().find(c => c.id === id);
    }
}