import { Injectable, ResourceRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CrmTicket, PmIssue, Ticket, TicketDetails, TicketListItem, User } from '../types';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class TicketDetailService {
    private users: User[] = [
        {
            id: 'u1',
            fullName: 'Jan Kowalski',
            email: 'jan.kowalski@example.com',
            avatarUrl: 'https://i.pravatar.cc/40?u=1',
            role: 'agent'
        },
        {
            id: 'u2',
            fullName: 'Anna Nowak',
            email: 'anna.nowak@example.com',
            avatarUrl: 'https://i.pravatar.cc/40?u=2',
            role: 'manager'
        },
        {
            id: 'u3',
            fullName: 'Piotr Wiśniewski',
            email: 'piotr.wisniewski@example.com',
            avatarUrl: 'https://i.pravatar.cc/40?u=3',
            role: 'developer'
        },
        {
            id: 'u4',
            fullName: 'Magdalena Zając',
            email: 'magdalena.zajac@example.com',
            avatarUrl: 'https://i.pravatar.cc/40?u=4',
            role: 'developer'
        },
        {
            id: 'u5',
            fullName: 'Tomasz Nowicki',
            email: 'tomasz.nowicki@example.com',
            avatarUrl: 'https://i.pravatar.cc/40?u=5',
            role: 'admin'
        },
        {
            id: 'u6',
            fullName: 'Ewa Malinowska',
            email: 'ewa.malinowska@example.com',
            avatarUrl: 'https://i.pravatar.cc/40?u=6',
            role: 'agent'
        },
        {
            id: 'u7',
            fullName: 'Grzegorz Adamski',
            email: 'grzegorz.adamski@example.com',
            avatarUrl: 'https://i.pravatar.cc/40?u=7',
            role: 'developer'
        },
        {
            id: 'u8',
            fullName: 'Katarzyna Lewandowska',
            email: 'katarzyna.lewandowska@example.com',
            avatarUrl: 'https://i.pravatar.cc/40?u=8',
            role: 'admin'
        }
    ];

    private mockCrmTickets: CrmTicket[] = [
        {
            id: 'crm-1',
            ticketNumber: 'REQ-1234',
            type: 'crm',
            title: 'Problem z logowaniem do systemu',
            description: 'Klient nie może zalogować się do panelu od dwóch dni. Otrzymuje komunikat "Nieprawidłowe dane". Reset hasła nie pomaga.',
            status: 'in_progress',
            priority: 'high',
            createdAt: new Date('2025-02-10T09:23:00'),
            updatedAt: new Date('2025-02-15T14:30:00'),
            createdBy: this.users[0],
            assignedTo: this.users[1],
            tags: ['logowanie', 'SSO'],
            comments: [
                {
                    id: 'c1',
                    content: 'Sprawdziliśmy logi – wygląda na problem z kontem AD. Przekazałem do zespołu IAM.',
                    createdAt: new Date('2025-02-10T10:15:00'),
                    author: this.users[1],
                    isInternal: true
                },
                {
                    id: 'c2',
                    content: 'Czy klient próbował z innej przeglądarki?',
                    createdAt: new Date('2025-02-11T08:30:00'),
                    author: this.users[2],
                    isInternal: true
                }
            ],
            attachments: [
                {
                    id: 'a1',
                    fileName: 'screenshot_error.png',
                    fileSize: 245760,
                    mimeType: 'image/png',
                    url: '/assets/screenshots/error.png',
                    uploadedAt: new Date('2025-02-10T09:25:00'),
                    uploadedBy: this.users[0]
                }
            ],
            customer: this.users[7],
            account: 'Firma XYZ',
            channel: 'email',
            slaDeadline: new Date('2025-02-18T17:00:00'),
            contractId: 'CONT-001',
            product: 'Portal klienta'
        },
        {
            id: 'crm-2',
            ticketNumber: 'REQ-2345',
            type: 'crm',
            title: 'Dostęp do API dla partnera',
            description: 'Partner potrzebuje klucza API do integracji. Proszę o wygenerowanie i przesłanie.',
            status: 'waiting_for_customer',
            priority: 'medium',
            createdAt: new Date('2025-02-01T08:30:00'),
            updatedAt: new Date('2025-02-17T10:00:00'),
            createdBy: this.users[1],
            tags: ['API', 'integracja'],
            comments: [],
            attachments: [],
            customer: this.users[7],
            account: 'Acme Corp',
            channel: 'portal',
            product: 'API Gateway'
        }
    ];

    private mockPmIssues: PmIssue[] = [
        {
            id: 'pm-1',
            ticketNumber: 'BUG-5678',
            type: 'pm',
            title: 'Błąd zapisu w module raportów',
            description: 'Podczas generowania raportu Excel pojawia się błąd 500, gdy dane przekraczają 10 000 wierszy. Stacktrace: ...',
            status: 'doing',
            priority: 'critical',
            createdAt: new Date('2025-02-14T11:05:00'),
            updatedAt: new Date('2025-02-16T09:12:00'),
            createdBy: this.users[2],
            assignedTo: this.users[3],
            tags: ['backend', 'raporty'],
            comments: [
                {
                    id: 'c3',
                    content: 'Zidentyfikowałem problem – limit pamięci w kontenerze. Zwiększyłem limit, ale potrzebujemy optymalizacji zapytania.',
                    createdAt: new Date('2025-02-15T14:20:00'),
                    author: this.users[3],
                    isInternal: true
                }
            ],
            attachments: [
                {
                    id: 'a2',
                    fileName: 'stacktrace.log',
                    fileSize: 10240,
                    mimeType: 'text/plain',
                    url: '/assets/logs/stacktrace.log',
                    uploadedAt: new Date('2025-02-14T11:10:00'),
                    uploadedBy: this.users[2]
                }
            ],
            issueType: 'bug',
            storyPoints: 5,
            sprint: 'Sprint 24',
            affectedVersions: ['v2.1.0', 'v2.2.0'],
            fixedVersions: ['v2.3.0']
        },
        {
            id: 'pm-2',
            ticketNumber: 'TASK-7890',
            type: 'pm',
            title: 'Aktualizacja dokumentacji',
            description: 'Należy zaktualizować dokumentację API o nowe endpointy dodane w wersji 2.2.',
            status: 'todo',
            priority: 'low',
            createdAt: new Date('2025-02-16T15:45:00'),
            updatedAt: new Date('2025-02-16T15:45:00'),
            createdBy: this.users[4],
            tags: ['docs', 'wiki'],
            comments: [],
            attachments: [],
            issueType: 'task',
            storyPoints: 2,
            sprint: 'Backlog'
        }
    ];

    private mockTicketListItems: TicketListItem[] = [
        {
            id: 'crm-1',
            ticketNumber: 'REQ-1234',
            title: 'Problem z logowaniem do systemu',
            description: 'Użytkownik nie może się zalogować przez SSO.',
            type: 'crm',
            status: 'in_progress',
            priority: 'high',
            createdAt: new Date('2025-02-10T09:23:00'),
            updatedAt: new Date('2025-02-15T14:30:00'),
            createdBy: { id: 'u1', fullName: 'Jan Kowalski', avatarUrl: 'https://i.pravatar.cc/40?u=1' },
            assignedTo: { id: 'u2', fullName: 'Anna Nowak', avatarUrl: 'https://i.pravatar.cc/40?u=2' },
            commentCount: 2,
            attachmentCount: 1,
            tags: ['logowanie', 'SSO'],
            customerName: 'Firma XYZ',
            selected: false,
            isExpanded: false
        },
        {
            id: 'pm-1',
            ticketNumber: 'BUG-5678',
            title: 'Błąd zapisu w module raportów',
            description: 'Błąd zapisu do bazy danych przy generowaniu raportu.',
            type: 'pm',
            status: 'doing',
            priority: 'critical',
            createdAt: new Date('2025-02-14T11:05:00'),
            updatedAt: new Date('2025-02-16T09:12:00'),
            createdBy: { id: 'u3', fullName: 'Piotr Wiśniewski', avatarUrl: 'https://i.pravatar.cc/40?u=3' },
            assignedTo: { id: 'u4', fullName: 'Magdalena Zając', avatarUrl: 'https://i.pravatar.cc/40?u=4' },
            commentCount: 1,
            attachmentCount: 1,
            tags: ['backend', 'raporty'],
            issueType: 'bug',
            selected: false,
            isExpanded: false
        },
        {
            id: 'crm-2',
            ticketNumber: 'REQ-2345',
            title: 'Dostęp do API dla partnera',
            description: 'Partner wymaga dostępu do REST API.',
            type: 'crm',
            status: 'waiting_for_customer',
            priority: 'medium',
            createdAt: new Date('2025-02-01T08:30:00'),
            updatedAt: new Date('2025-02-17T10:00:00'),
            createdBy: { id: 'u2', fullName: 'Anna Nowak', avatarUrl: 'https://i.pravatar.cc/40?u=2' },
            assignedTo: undefined,
            commentCount: 0,
            attachmentCount: 0,
            tags: ['API', 'integracja'],
            customerName: 'Acme Corp',
            selected: false,
            isExpanded: false
        },
        {
            id: 'pm-2',
            ticketNumber: 'TASK-7890',
            title: 'Aktualizacja dokumentacji',
            description: 'Aktualizacja dokumentacji technicznej.',
            type: 'pm',
            status: 'todo',
            priority: 'low',
            createdAt: new Date('2025-02-16T15:45:00'),
            updatedAt: new Date('2025-02-16T15:45:00'),
            createdBy: { id: 'u5', fullName: 'Tomasz Nowicki', avatarUrl: 'https://i.pravatar.cc/40?u=5' },
            assignedTo: undefined,
            commentCount: 0,
            attachmentCount: 0,
            tags: ['docs', 'wiki'],
            issueType: 'task',
            selected: false,
            isExpanded: false
        }
    ];

    private allTickets: Ticket[] = [...this.mockCrmTickets, ...this.mockPmIssues];

    getResource(): ResourceRef<TicketDetails | undefined> {
        return rxResource<TicketDetails, any>({
            params: ()=> ({id: 'test'}),
            stream: ({params})=> this.getRandomTicketDetails(),
            defaultValue: undefined,
        })
    }
    // Symuluje pobieranie losowego ticketu z opóźnieniem
    private getRandomTicketDetails(): Observable<TicketDetails> {
        const randomIndex = Math.floor(Math.random() * this.allTickets.length);
        const ticket = this.allTickets[randomIndex];

        // Losowo wybieramy 1-3 powiązane tickety (inne niż ten)
        const otherTickets = this.allTickets.filter(t => t.id !== ticket.id);
        const shuffled = otherTickets.sort(() => 0.5 - Math.random());
        const related = shuffled.slice(0, Math.floor(Math.random() * 3) + 1).map(t => {
            // Mapujemy na TicketListItem (uproszczony)
            const listItem: TicketListItem = {
                id: t.id,
                ticketNumber: t.ticketNumber,
                title: t.title,
                description: t.description,
                type: t.type,
                status: t.status,
                priority: t.priority,
                createdAt: t.createdAt,
                updatedAt: t.updatedAt,
                createdBy: { id: t.createdBy.id, fullName: t.createdBy.fullName, avatarUrl: t.createdBy.avatarUrl },
                assignedTo: t.assignedTo ? { id: t.assignedTo.id, fullName: t.assignedTo.fullName, avatarUrl: t.assignedTo.avatarUrl } : undefined,
                commentCount: t.comments.length,
                attachmentCount: t.attachments.length,
                tags: t.tags,
                issueType: t.type === 'pm' ? t.issueType : undefined,
                customerName: t.type === 'crm' ? t.customer?.fullName : undefined,
                selected: false,
                isExpanded: false
            };
            return listItem;
        });

        const details: TicketDetails = {
            ...ticket,
            relatedTickets: related,
            timeTracking: {
                totalTimeSpent: Math.floor(Math.random() * 480) + 60, // 1-8h w minutach
                timeRemaining: Math.floor(Math.random() * 240) + 30
            },
            isLoading: false,
            error: undefined
        };

        // Symulacja opóźnienia sieciowego
        return of(details).pipe(delay(1000));
    }
}