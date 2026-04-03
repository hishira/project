import { render, screen } from '@testing-library/angular';
import { OfferSummaryComponent } from './offer-summary.component';
import { Offer } from '../../offer.model';
import { vi } from 'vitest';

describe('OfferSummaryComponent', () => {
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
    tags: ['tag1', 'tag2'],
    currentVersion: 1,
    versions: [],
    approvals: [],
    createdBy: 'Test User',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  };

  const setup = async (offer?: Partial<Offer>) => {
    const offerData = { ...mockOffer, ...offer };

    await render(OfferSummaryComponent, {
      inputs: { offer: offerData },
    });
  };

  test('should display "Podsumowanie" header', async () => {
    await setup();
    expect(screen.getByText('Podsumowanie')).toBeInTheDocument();
  });

  test('should display client name', async () => {
    await setup();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
  });

  test('should display offer title', async () => {
    await setup();
    expect(screen.getByText('Test Offer')).toBeInTheDocument();
  });

  test('should display issue date', async () => {
    await setup();
    expect(screen.getByText(/15 Jan 2024/)).toBeInTheDocument();
  });

  test('should display valid until date', async () => {
    await setup();
    expect(screen.getByText(/15 Feb 2024/)).toBeInTheDocument();
  });

  test('should display status label in Polish', async () => {
    await setup();
    expect(screen.getByText('Szkic')).toBeInTheDocument();
  });

  test('should display total gross value with currency', async () => {
    await setup();
    expect(screen.getByText(/1,230\.00/)).toBeInTheDocument();
    expect(screen.getByText('PLN')).toBeInTheDocument();
  });

  test('should display description when provided', async () => {
    await setup();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('should not display description when not provided', async () => {
    await setup({ description: undefined });
    const descriptionElements = screen.queryAllByText('Test description');
    expect(descriptionElements).toHaveLength(0);
  });

  test('should display notes when provided', async () => {
    await setup();
    expect(screen.getByText('Test notes')).toBeInTheDocument();
  });

  test('should not display notes when not provided', async () => {
    await setup({ notes: undefined });
    const notesElements = screen.queryAllByText('Test notes');
    expect(notesElements).toHaveLength(0);
  });

  test('should display tags when provided', async () => {
    await setup();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  test('should not display tags section when tags array is empty', async () => {
    await setup({ tags: [] });
    const tagElements = screen.queryAllByText('tag1');
    expect(tagElements).toHaveLength(0);
  });

  test('should display "Wysłana" status for sent offers', async () => {
    await setup({ status: 'sent' });
    expect(screen.getByText('Wysłana')).toBeInTheDocument();
  });

  test('should display "Zaakceptowana" status for accepted offers', async () => {
    await setup({ status: 'accepted' });
    expect(screen.getByText('Zaakceptowana')).toBeInTheDocument();
  });

  test('should display "Odrzucona" status for rejected offers', async () => {
    await setup({ status: 'rejected' });
    expect(screen.getByText('Odrzucona')).toBeInTheDocument();
  });

  test('should display "Wygasła" status for expired offers', async () => {
    await setup({ status: 'expired' });
    expect(screen.getByText('Wygasła')).toBeInTheDocument();
  });
});
