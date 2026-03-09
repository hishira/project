import { Injectable, signal } from '@angular/core';
import { CustomerLoyalty, Reward, PointsTransaction } from './loyalty.model';

@Injectable({ providedIn: 'root' })
export class LoyaltyService {
  private customersData: CustomerLoyalty[] = [
    {
      customerId: 'c1',
      customerName: 'Tymbark Sp. z o.o.',
      customerEmail: 'biuro@tymbark.pl',
      points: 1250,
      lifetimePoints: 2450,
      level: 'silver',
      nextLevelThreshold: 2500,
      pointsToNextLevel: 1250,
      transactions: [
        { id: 't1', date: new Date('2025-02-10'), description: 'Zakup faktura FV/2025/02/15', pointsChange: 350, balanceAfter: 350, source: 'purchase', relatedInvoiceId: 'inv1' },
        { id: 't2', date: new Date('2025-02-20'), description: 'Zakup faktura FV/2025/02/22', pointsChange: 400, balanceAfter: 750, source: 'purchase' },
        { id: 't3', date: new Date('2025-03-01'), description: 'Bonus za urodziny firmy', pointsChange: 500, balanceAfter: 1250, source: 'bonus' }
      ],
      rewards: []
    },
    {
      customerId: 'c2',
      customerName: 'Capri-Sun Polska',
      customerEmail: 'kontakt@capri.pl',
      points: 3200,
      lifetimePoints: 3200,
      level: 'gold',
      nextLevelThreshold: 5000,
      pointsToNextLevel: 1800,
      transactions: [
        { id: 't4', date: new Date('2025-01-15'), description: 'Zakup faktura FV/2025/01/12', pointsChange: 800, balanceAfter: 800, source: 'purchase' },
        { id: 't5', date: new Date('2025-02-05'), description: 'Zakup faktura FV/2025/02/03', pointsChange: 1200, balanceAfter: 2000, source: 'purchase' },
        { id: 't6', date: new Date('2025-02-28'), description: 'Wymiana punktów na rabat', pointsChange: -500, balanceAfter: 1500, source: 'reward' },
        { id: 't7', date: new Date('2025-03-05'), description: 'Zakup faktura FV/2025/03/01', pointsChange: 1700, balanceAfter: 3200, source: 'purchase' }
      ],
      rewards: [
        { id: 'r1', name: 'Rabat 50 PLN', description: 'Rabat na kolejne zamówienie', pointsCost: 500, discount: 50, discountType: 'fixed', code: 'SAVE50-ABC', expiresAt: new Date('2025-04-30') }
      ]
    },
    {
      customerId: 'c3',
      customerName: 'PepsiCo Polska',
      customerEmail: 'recepcja@pepsico.pl',
      points: 480,
      lifetimePoints: 480,
      level: 'bronze',
      nextLevelThreshold: 1000,
      pointsToNextLevel: 520,
      transactions: [
        { id: 't8', date: new Date('2025-03-07'), description: 'Zakup faktura FV/2025/03/07', pointsChange: 480, balanceAfter: 480, source: 'purchase' }
      ],
      rewards: []
    }
  ];

  readonly customers = signal<CustomerLoyalty[]>(this.customersData);

  // Poziomy (stałe dla programu)
  readonly levels = [
    { name: 'bronze', threshold: 0, discount: 0, benefits: ['Podstawowe wsparcie'] },
    { name: 'silver', threshold: 1000, discount: 3, benefits: ['3% rabatu', 'Priorytetowa obsługa'] },
    { name: 'gold', threshold: 2500, discount: 5, benefits: ['5% rabatu', 'Dedykowany opiekun'] },
    { name: 'platinum', threshold: 5000, discount: 10, benefits: ['10% rabatu', 'Darmowa dostawa', 'Ekskluzywne wydarzenia'] }
  ];

  getCustomerLoyalty(customerId: string): CustomerLoyalty | undefined {
    return this.customers().find(c => c.customerId === customerId);
  }

  addPoints(customerId: string, points: number, description: string, invoiceId?: string) {
    console.log('Dodawanie punktów:', customerId, points, description);
  }

  redeemReward(customerId: string, rewardId: string) {
    console.log('Wykorzystanie nagrody:', customerId, rewardId);
  }

  generateReward(customerId: string, reward: Omit<Reward, 'id'>) {
    console.log('Generowanie nagrody dla:', customerId, reward);
  }
}