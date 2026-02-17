import { Injectable, signal } from '@angular/core';
import { TicketListItem } from './types';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private mockTickets: TicketListItem[] = [
    {
      id: '1',
      ticketNumber: 'REQ-1234',
      title: 'Problem z logowaniem do systemu',
      type: 'crm',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2025-02-10T09:23:00'),
      updatedAt: new Date('2025-02-15T14:30:00'),
      createdBy: { id: 'u1', fullName: 'Jan Kowalski', avatarUrl: 'https://i.pravatar.cc/40?u=1' },
      assignedTo: { id: 'u2', fullName: 'Anna Nowak', avatarUrl: 'https://i.pravatar.cc/40?u=2' },
      commentCount: 5,
      attachmentCount: 2,
      tags: ['logowanie', 'SSO'],
      customerName: 'Firma XYZ',
      selected: false,
      isExpanded: false
    },
    {
      id: '2',
      ticketNumber: 'BUG-5678',
      title: 'Błąd zapisu w module raportów',
      type: 'pm',
      status: 'doing',
      priority: 'critical',
      createdAt: new Date('2025-02-14T11:05:00'),
      updatedAt: new Date('2025-02-16T09:12:00'),
      createdBy: { id: 'u3', fullName: 'Piotr Wiśniewski', avatarUrl: 'https://i.pravatar.cc/40?u=3' },
      assignedTo: { id: 'u4', fullName: 'Magdalena Zając', avatarUrl: 'https://i.pravatar.cc/40?u=4' },
      commentCount: 8,
      attachmentCount: 1,
      tags: ['backend', 'raporty'],
      issueType: 'bug',
      selected: false,
      isExpanded: false
    },
    {
      id: '3',
      ticketNumber: 'REQ-2345',
      title: 'Dostęp do API dla partnera',
      type: 'crm',
      status: 'waiting_for_customer',
      priority: 'medium',
      createdAt: new Date('2025-02-01T08:30:00'),
      updatedAt: new Date('2025-02-17T10:00:00'),
      createdBy: { id: 'u2', fullName: 'Anna Nowak', avatarUrl: 'https://i.pravatar.cc/40?u=2' },
      assignedTo: undefined,
      commentCount: 2,
      attachmentCount: 0,
      tags: ['API', 'integracja'],
      customerName: 'Acme Corp',
      selected: false,
      isExpanded: false
    },
    {
      id: '4',
      ticketNumber: 'TASK-7890',
      title: 'Aktualizacja dokumentacji',
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
    },
    {
      id: '5',
      ticketNumber: 'REQ-3456',
      title: 'Nowa funkcja eksportu do PDF',
      type: 'crm',
      status: 'resolved',
      priority: 'medium',
      createdAt: new Date('2025-02-05T13:20:00'),
      updatedAt: new Date('2025-02-15T11:30:00'),
      createdBy: { id: 'u1', fullName: 'Jan Kowalski', avatarUrl: 'https://i.pravatar.cc/40?u=1' },
      assignedTo: { id: 'u6', fullName: 'Ewa Malinowska', avatarUrl: 'https://i.pravatar.cc/40?u=6' },
      commentCount: 12,
      attachmentCount: 3,
      tags: ['PDF', 'eksport'],
      customerName: 'Beta Solutions',
      selected: false,
      isExpanded: false
    },
    {
      id: '6',
      ticketNumber: 'BUG-6789',
      title: 'Błąd 500 przy zapisie dużego pliku',
      type: 'pm',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2025-02-12T10:10:00'),
      updatedAt: new Date('2025-02-17T08:45:00'),
      createdBy: { id: 'u7', fullName: 'Grzegorz Adamski', avatarUrl: 'https://i.pravatar.cc/40?u=7' },
      assignedTo: { id: 'u3', fullName: 'Piotr Wiśniewski', avatarUrl: 'https://i.pravatar.cc/40?u=3' },
      commentCount: 3,
      attachmentCount: 1,
      tags: ['backend', 'plik'],
      issueType: 'bug',
      selected: false,
      isExpanded: false
    },
    {
      id: '7',
      ticketNumber: 'FEAT-1111',
      title: 'Nowy dashboard dla menedżera',
      type: 'pm',
      status: 'doing',
      priority: 'medium',
      createdAt: new Date('2025-02-09T09:00:00'),
      updatedAt: new Date('2025-02-14T16:30:00'),
      createdBy: { id: 'u2', fullName: 'Anna Nowak', avatarUrl: 'https://i.pravatar.cc/40?u=2' },
      assignedTo: { id: 'u5', fullName: 'Tomasz Nowicki', avatarUrl: 'https://i.pravatar.cc/40?u=5' },
      commentCount: 6,
      attachmentCount: 2,
      tags: ['dashboard', 'UI'],
      issueType: 'feature',
      selected: false,
      isExpanded: false
    }
  ];

  // Sygnał przechowujący listę ticketów (możemy później aktualizować)
  //readonly tickets = signal<TicketListItem[]>(this.mockTickets);

  // Metoda do symulacji zaznaczenia/odznaczenia wszystkich (dla przyszłych akcji)
  readonly ticketsResource = rxResource({
    stream: () => of(this.mockTickets).pipe(delay(1500))
  });

  // Dla wygody eksponujemy sygnał z wartością (gdy dane są gotowe)
  readonly tickets = this.ticketsResource.value;

  // Metody do akcji (np. toggleAll) – aktualizują dane poprzez zmianę zasobu?
  // W praktyce po wykonaniu akcji modyfikującej dane, należy odświeżyć zasób
  // lub zaktualizować lokalnie. Dla uproszczenia zostawiamy bez zapisu.
  toggleAll(selected: boolean): void {
    // Gdybyśmy chcieli zaktualizować dane, można by pobrać aktualną wartość
    // i zaktualizować resource przez set, ale to wymagałoby dodatkowej logiki.
    // W wersji demonstracyjnej pomijamy.
  }
}