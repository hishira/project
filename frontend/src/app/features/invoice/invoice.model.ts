export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'payu' | 'stripe' | 'cash';

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  netPrice: number;
  vatRate: number;
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
}

export interface Payment {
  id: string;
  date: Date;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  issueDate: Date;
  saleDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  items: InvoiceItem[];
  totalNet: number;
  totalVat: number;
  totalGross: number;
  currency: string;
  notes?: string;
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}