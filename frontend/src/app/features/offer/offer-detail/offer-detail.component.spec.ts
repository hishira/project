import { render, screen, fireEvent } from '@testing-library/angular';
import { OfferDetailComponent } from './offer-detail.component';
import { ActivatedRoute } from '@angular/router';
import { OfferService } from '../offer.service';
import { MatDialog } from '@angular/material/dialog';
import { Offer } from '../offer.model';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('OfferDetailComponent', () => {
  const mockOffer: Offer = {
    id: '1',
    number: 'OF/2024/001',
    title: 'Test Offer',
    description: 'Test description',
    clientId: 'c1',
    clientName: 'Test Client',
    issueDate: new Date('2024-01-15'),
    validUntil: new Date('2024-02-15'),
    status: 'draft',
    items: [],
    totalNet: 1000,
    totalVat: 230,
    totalGross: 1230,
    currency: 'PLN',
    notes: 'Test notes',
    tags: ['tag1'],
    currentVersion: 1,
    versions: [],
    approvals: [],
    createdBy: 'Test User',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  };

  const mockOfferService = {
    getOfferById: vi.fn(),
    requestApproval: vi.fn(),
  };

  const mockDialog = {
    open: vi.fn(),
  };

  const mockRoute = {
    snapshot: {
      paramMap: {
        get: vi.fn(),
      },
    },
  };

  const setup = async (offerId?: string | null, offer?: Offer | null) => {
    mockRoute.snapshot.paramMap.get.mockReturnValue(offerId);
    mockOfferService.getOfferById.mockReturnValue(offer || null);

    const dialogRef = {
      afterClosed: vi.fn().mockReturnValue(of({ comments: 'Test comments' })),
    };
    mockDialog.open.mockReturnValue(dialogRef);

    await render(OfferDetailComponent, {
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: OfferService, useValue: mockOfferService },
        { provide: MatDialog, useValue: mockDialog },
      ],
    });

    return { mockOfferService, mockDialog, dialogRef };
  };

  test('should display offer number in header when offer exists', async () => {
    await setup('1', mockOffer);
    expect(screen.getByText(/OF\/2024\/001/)).toBeInTheDocument();
  });

  test('should display "Nie znaleziono oferty" when offer not found', async () => {
    await setup('999', null);
    expect(screen.getByText('Nie znaleziono oferty')).toBeInTheDocument();
  });

  test('should display back to list button when offer not found', async () => {
    await setup('999', null);
    expect(screen.getByText('Powrót do listy')).toBeInTheDocument();
  });

  test('should display PDF button when offer exists', async () => {
    await setup('1', mockOffer);
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  test('should display Edit button when offer exists', async () => {
    await setup('1', mockOffer);
    expect(screen.getByText('Edytuj')).toBeInTheDocument();
  });

  test('should display "Wyślij do akceptacji" button for draft offers', async () => {
    await setup('1', { ...mockOffer, status: 'draft' });
    expect(screen.getByText('Wyślij do akceptacji')).toBeInTheDocument();
  });

  test('should not display "Wyślij do akceptacji" button for non-draft offers', async () => {
    await setup('1', { ...mockOffer, status: 'sent' });
    const sendButton = screen.queryByText('Wyślij do akceptacji');
    expect(sendButton).not.toBeInTheDocument();
  });

  test('should call onGeneratePdf when PDF button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await setup('1', mockOffer);
    const pdfButton = screen.getByText('PDF');
    fireEvent.click(pdfButton);
    expect(consoleSpy).toHaveBeenCalledWith('Generuj PDF oferty', '1');
    consoleSpy.mockRestore();
  });

  test('should open approval dialog when "Wyślij do akceptacji" is clicked', async () => {
    const { mockDialog } = await setup('1', { ...mockOffer, status: 'draft' });
    const sendButton = screen.getByText('Wyślij do akceptacji');
    fireEvent.click(sendButton);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  test('should request approval when dialog is closed with result', async () => {
    const { mockOfferService } = await setup('1', { ...mockOffer, status: 'draft' });
    const sendButton = screen.getByText('Wyślij do akceptacji');
    fireEvent.click(sendButton);
    expect(mockOfferService.requestApproval).toHaveBeenCalledWith('1', 'Test comments');
  });

  test('should not request approval when offer is undefined', async () => {
    const { mockOfferService, mockDialog } = await setup('1', null);
    // Component should handle missing offer gracefully
    expect(mockOfferService.requestApproval).not.toHaveBeenCalled();
  });

  test('should render offer summary when offer exists', async () => {
    await setup('1', mockOffer);
    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('Test Offer')).toBeInTheDocument();
  });

  test('should render offer items table when offer exists', async () => {
    await setup('1', { ...mockOffer, items: [] });
    expect(screen.getByText('Pozycje oferty')).toBeInTheDocument();
  });

  test('should render versions and approvals tabs when offer exists', async () => {
    await setup('1', mockOffer);
    expect(screen.getByText('Wersje')).toBeInTheDocument();
    expect(screen.getByText('Akceptacje')).toBeInTheDocument();
  });
});
