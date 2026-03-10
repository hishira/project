import { Injectable, signal } from '@angular/core';
import { Offer, OfferItem, Approval } from './offer.model';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private offersData: Offer[] = [
    {
      id: 'off1',
      number: 'OF/2025/03/001',
      title: 'Dostawa soków dla Tymbark',
      description: 'Oferta ramowa na dostawy w II kwartale',
      clientId: 'c1',
      clientName: 'Tymbark Sp. z o.o.',
      issueDate: new Date('2025-03-01'),
      validUntil: new Date('2025-04-15'),
      status: 'sent',
      items: [
        {
          id: 'i1',
          name: 'Sok jabłkowy 1L',
          quantity: 500,
          unit: 'szt',
          netPrice: 3.20,
          discountPercent: 5,
          vatRate: 23,
          netAmount: 1520,   // 500*3.20*0.95
          vatAmount: 349.60,
          grossAmount: 1869.60
        },
        {
          id: 'i2',
          name: 'Sok pomarańczowy 1L',
          quantity: 300,
          unit: 'szt',
          netPrice: 3.50,
          vatRate: 23,
          netAmount: 1050,
          vatAmount: 241.50,
          grossAmount: 1291.50
        }
      ],
      totalNet: 2570,
      totalVat: 591.10,
      totalGross: 3161.10,
      currency: 'PLN',
      notes: 'Rabat 5% na pierwszą pozycję',
      tags: ['ramowa', 'dostawy'],
      currentVersion: 1,
      versions: [
        {
          version: 1,
          createdAt: new Date('2025-03-01'),
          createdBy: 'Jan Kowalski',
          changes: 'Wersja pierwotna',
          data: {}
        }
      ],
      approvals: [
        {
          id: 'a1',
          status: 'approved',
          requestedBy: 'Jan Kowalski',
          requestedAt: new Date('2025-03-01'),
          reviewedBy: 'Anna Nowak',
          reviewedAt: new Date('2025-03-02'),
          comments: 'Akceptuję warunki'
        }
      ],
      createdBy: 'Jan Kowalski',
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-02')
    },
    {
      id: 'off2',
      number: 'OF/2025/03/002',
      title: 'Nowa linia produktów dla Capri',
      clientId: 'c2',
      clientName: 'Capri-Sun Polska',
      issueDate: new Date('2025-03-05'),
      validUntil: new Date('2025-04-05'),
      status: 'draft',
      items: [
        {
          id: 'i3',
          name: 'Sok multiwitamina 0.33L',
          quantity: 1000,
          unit: 'szt',
          netPrice: 2.10,
          vatRate: 23,
          netAmount: 2100,
          vatAmount: 483,
          grossAmount: 2583
        }
      ],
      totalNet: 2100,
      totalVat: 483,
      totalGross: 2583,
      currency: 'PLN',
      tags: ['nowy produkt'],
      currentVersion: 1,
      versions: [],
      approvals: [],
      createdBy: 'Anna Nowak',
      createdAt: new Date('2025-03-05'),
      updatedAt: new Date('2025-03-05')
    }
  ];

  readonly offers = signal<Offer[]>(this.offersData);

  getOfferById(id: string): Offer | undefined {
    return this.offers().find(o => o.id === id);
  }

  createOffer(offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'currentVersion' | 'approvals' | 'number'>) {
    console.log('Tworzenie oferty:', offer);
    // W rzeczywistości API zwróci numer
  }

  updateOffer(id: string, changes: Partial<Offer>) {
    console.log('Aktualizacja oferty:', id, changes);
  }

  deleteOffer(id: string) {
    console.log('Usuwanie oferty:', id);
  }

  requestApproval(id: string, comments?: string) {
    console.log('Żądanie akceptacji dla oferty:', id, comments);
  }
}