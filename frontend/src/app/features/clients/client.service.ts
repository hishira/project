import { Injectable, signal } from '@angular/core';
import { Client } from './client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
    private clientsData: Client[] = [
        {
            id: 'c1',
            name: 'Tymbark Sp. z o.o.',
            shortName: 'Tymbark',
            taxId: '123-456-78-90',
            industry: 'Spożywczy',
            website: 'https://tymbark.pl',
            phone: '+48 22 123 45 67',
            email: 'kontakt@tymbark.pl',
            address: {
                street: 'ul. Przemysłowa 10',
                city: 'Warszawa',
                postalCode: '00-001',
                country: 'Polska'
            },
            status: 'active',
            contacts: [
                {
                    id: 'cont1',
                    clientId: 'c1',
                    fullName: 'Anna Kowalska',
                    position: 'Dyrektor Zakupów',
                    phone: '+48 600 100 200',
                    email: 'anna.kowalska@tymbark.pl',
                    isPrimary: true
                },
                {
                    id: 'cont2',
                    clientId: 'c1',
                    fullName: 'Piotr Nowak',
                    position: 'Specjalista ds. Logistyki',
                    phone: '+48 600 200 300',
                    email: 'piotr.nowak@tymbark.pl',
                    isPrimary: false
                }
            ],
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2025-03-15'),
            assignedTo: 'Jan Kowalski',
            tags: ['kluczowy', 'bio'],
            mainContactName: 'Anna Kowalska',
            documentsCount: 2,
            lastContactDate: new Date('2025-03-20')
        },
        {
            id: 'c2',
            name: 'Capri-Sun Polska',
            shortName: 'Capri',
            taxId: '987-654-32-10',
            industry: 'Napoje',
            website: 'https://capri-sun.pl',
            phone: '+48 22 987 65 43',
            email: 'info@capri.pl',
            address: {
                street: 'ul. Owocowa 5',
                city: 'Kraków',
                postalCode: '30-001',
                country: 'Polska'
            },
            status: 'active',
            contacts: [
                {
                    id: 'cont3',
                    clientId: 'c2',
                    fullName: 'Marek Wiśniewski',
                    position: 'Kierownik Zakupów',
                    phone: '+48 600 300 400',
                    email: 'marek.wisniewski@capri.pl',
                    isPrimary: true
                }
            ],
            createdAt: new Date('2024-05-20'),
            updatedAt: new Date('2025-02-10'),
            assignedTo: 'Anna Nowak',
            tags: ['międzynarodowy'],
            mainContactName: 'Marek Wiśniewski',
            documentsCount: 1,
            lastContactDate: new Date('2025-03-10')
        },
        {
            id: 'c3',
            name: 'PepsiCo Polska',
            shortName: 'Pepsi',
            taxId: '111-222-33-44',
            industry: 'Spożywczy',
            website: 'https://pepsico.pl',
            phone: '+48 22 555 66 77',
            email: 'kontakt@pepsico.pl',
            status: 'active',
            contacts: [],
            createdAt: new Date('2024-08-01'),
            updatedAt: new Date('2025-01-15'),
            assignedTo: 'Piotr Wiśniewski',
            tags: ['globalny'],
            documentsCount: 1,
            lastContactDate: new Date('2025-02-28')
        },
        {
            id: 'c4',
            name: 'Coca-Cola HBC Polska',
            shortName: 'Coca-Cola',
            taxId: '555-666-77-88',
            industry: 'Napoje',
            website: 'https://coca-cola.pl',
            phone: '+48 22 444 55 66',
            email: 'biuro@coca-cola.pl',
            status: 'lead',
            contacts: [
                {
                    id: 'cont4',
                    clientId: 'c4',
                    fullName: 'Tomasz Lewandowski',
                    position: 'Category Manager',
                    phone: '+48 600 400 500',
                    email: 'tomasz.lewandowski@coca-cola.pl',
                    isPrimary: true
                }
            ],
            createdAt: new Date('2025-02-10'),
            updatedAt: new Date('2025-03-18'),
            assignedTo: 'Jan Kowalski',
            tags: ['negocjacje'],
            mainContactName: 'Tomasz Lewandowski',
            documentsCount: 0,
            lastContactDate: new Date('2025-03-18')
        }
    ];

    readonly clients = signal<Client[]>(this.clientsData);

    getClientById(id: string): Client | undefined {
        return this.clients().find(c => c.id === id);
    }
}