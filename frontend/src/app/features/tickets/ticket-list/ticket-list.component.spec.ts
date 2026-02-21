//import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TicketListComponent } from './ticket-list.component';
import { TicketService } from '../ticket.service';
import { CommonRouterService } from '../../../core/services/common-router.service';
import { signal } from '@angular/core';

// Mock serwisu
class MockTicketService {
  ticketsResource = {
    value: signal([]),
    isLoading: signal(false),
    error: signal(undefined),
    reload: vi.fn(),
  };
  toggleAll = vi.fn();
}

// Mock routera
class MockCommonRouterService {
  navitgateTo = vi.fn();
}

describe('TicketListComponent', () => {
  const setup = async (options?: {
    tickets?: any[];
    isLoading?: boolean;
    error?: Error;
  }) => {
    const mockTicketService = new MockTicketService();
    const mockRouter = new MockCommonRouterService();

    if (options?.tickets) {
      mockTicketService.ticketsResource.value.set(options.tickets);
    }
    if (options?.isLoading !== undefined) {
      mockTicketService.ticketsResource.isLoading.set(options.isLoading);
    }
    if (options?.error) {
      mockTicketService.ticketsResource.error.set(options.error);
    }

    const user = userEvent.setup();

    await render(TicketListComponent, {
      providers: [
        { provide: TicketService, useValue: mockTicketService },
        { provide: CommonRouterService, useValue: mockRouter },
      ],
    });

    return { user, mockTicketService, mockRouter };
  };

  it('wyświetla nagłówek "Lista ticketów"', async () => {
    await setup();
    expect(screen.getByText('Lista ticketów')).toBeInTheDocument();
  });

  it('pokazuje loader podczas ładowania', async () => {
    await setup({ isLoading: true });
    expect(screen.getByText('Ładowanie ticketów...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('pokazuje komunikat błędu', async () => {
    await setup({ error: new Error('Błąd sieci') });
    expect(screen.getByText(/Nie udało się załadować ticketów:/)).toBeInTheDocument();
    expect(screen.getByText('Błąd sieci')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Spróbuj ponownie/i })).toBeInTheDocument();
  });

  it('renderuje listę ticketów', async () => {
    const mockTickets = [
      {
        id: '1',
        ticketNumber: 'TICKET-123',
        title: 'Testowy ticket',
        type: 'crm',
        priority: 'high',
        status: 'in_progress',
        selected: false,
        isExpanded: false,
        assignedTo: null,
        commentCount: 2,
        attachmentCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: { fullName: 'Jan Kowalski', avatarUrl: '' },
        tags: ['błąd'],
        customerName: 'Firma XYZ',
        issueType: undefined,
      },
    ];

    await setup({ tickets: mockTickets });

    expect(screen.getByText('TICKET-123')).toBeInTheDocument();
    expect(screen.getByText('Testowy ticket')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument(); // priorytet
    expect(screen.getByText('in progress')).toBeInTheDocument(); // status po zamianie znaków
    expect(screen.getByText('2')).toBeInTheDocument(); // liczba komentarzy
    expect(screen.getByText('1')).toBeInTheDocument(); // liczba załączników
  });

  it('wywołuje toggleAll(true) po kliknięciu "Zaznacz wszystkie"', async () => {
    const { user, mockTicketService } = await setup();
    await user.click(screen.getByRole('button', { name: /Zaznacz wszystkie/i }));
    expect(mockTicketService.toggleAll).toHaveBeenCalledWith(true);
  });

  it('wywołuje toggleAll(false) po kliknięciu "Odznacz wszystkie"', async () => {
    const { user, mockTicketService } = await setup();
    await user.click(screen.getByRole('button', { name: /Odznacz wszystkie/i }));
    expect(mockTicketService.toggleAll).toHaveBeenCalledWith(false);
  });
});

// import { describe, it, expect } from 'vitest';

// describe('dummy', () => {
//   it('should pass', () => {
//     expect(true).toBe(true);
//   });
// });