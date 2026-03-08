import { Injectable, signal } from '@angular/core';
import { Invoice, Payment } from './invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private invoicesData: Invoice[] = [
    {
      id: 'inv1',
      number: 'FV/2025/03/001',
      clientId: 'c1',
      clientName: 'Tymbark Sp. z o.o.',
      issueDate: new Date('2025-03-01'),
      saleDate: new Date('2025-02-28'),
      dueDate: new Date('2025-03-15'),
      status: 'paid',
      items: [
        { id: 'i1', name: 'Sok jabłkowy 1L', quantity: 100, unit: 'szt', netPrice: 3.50, vatRate: 23, netAmount: 350, vatAmount: 80.50, grossAmount: 430.50 },
        { id: 'i2', name: 'Sok pomarańczowy 1L', quantity: 50, unit: 'szt', netPrice: 3.80, vatRate: 23, netAmount: 190, vatAmount: 43.70, grossAmount: 233.70 }
      ],
      totalNet: 540,
      totalVat: 124.20,
      totalGross: 664.20,
      currency: 'PLN',
      payments: [{ id: 'p1', date: new Date('2025-03-10'), amount: 664.20, method: 'bank_transfer', reference: 'PRZELEW123' }],
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-10')
    },
    {
      id: 'inv2',
      number: 'FV/2025/03/002',
      clientId: 'c2',
      clientName: 'Capri-Sun Polska',
      issueDate: new Date('2025-03-05'),
      saleDate: new Date('2025-03-04'),
      dueDate: new Date('2025-03-19'),
      status: 'sent',
      items: [
        { id: 'i3', name: 'Sok multiwitamina 0.33L', quantity: 200, unit: 'szt', netPrice: 2.20, vatRate: 23, netAmount: 440, vatAmount: 101.20, grossAmount: 541.20 }
      ],
      totalNet: 440,
      totalVat: 101.20,
      totalGross: 541.20,
      currency: 'PLN',
      payments: [],
      createdAt: new Date('2025-03-05'),
      updatedAt: new Date('2025-03-05')
    },
    {
      id: 'inv3',
      number: 'FV/2025/02/099',
      clientId: 'c3',
      clientName: 'PepsiCo Polska',
      issueDate: new Date('2025-02-20'),
      saleDate: new Date('2025-02-18'),
      dueDate: new Date('2025-03-06'),
      status: 'overdue',
      items: [
        { id: 'i4', name: 'Sok grejpfrutowy 1L', quantity: 80, unit: 'szt', netPrice: 4.00, vatRate: 23, netAmount: 320, vatAmount: 73.60, grossAmount: 393.60 }
      ],
      totalNet: 320,
      totalVat: 73.60,
      totalGross: 393.60,
      currency: 'PLN',
      payments: [],
      createdAt: new Date('2025-02-20'),
      updatedAt: new Date('2025-02-20')
    }
  ];

  readonly invoices = signal<Invoice[]>(this.invoicesData);

  getInvoiceById(id: string): Invoice | undefined {
    return this.invoices().find(inv => inv.id === id);
  }

  createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) {
    console.log('Tworzenie faktury:', invoice);
  }

  updateInvoice(id: string, changes: Partial<Invoice>) {
    console.log('Aktualizacja faktury:', id, changes);
  }

  deleteInvoice(id: string) {
    console.log('Usuwanie faktury:', id);
  }

  registerPayment(invoiceId: string, payment: Omit<Payment, 'id'>) {
    console.log('Rejestracja płatności:', invoiceId, payment);
  }
}