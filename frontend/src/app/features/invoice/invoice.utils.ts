import { InvoiceStatus } from './invoice.model';

export interface InvoiceStatusColorConfig {
  [key: string]: string;
}

export interface InvoiceStatusLabelConfig {
  [key: string]: string;
}

export const INVOICE_STATUS_COLORS: InvoiceStatusColorConfig = {
  draft: '#e2e8f0',
  sent: '#dbeafe',
  paid: '#d1fae5',
  overdue: '#fee2e2',
  cancelled: '#f1f5f9',
};

export const INVOICE_STATUS_TEXT_COLORS: InvoiceStatusColorConfig = {
  draft: '#334155',
  sent: '#1e3a8a',
  paid: '#065f46',
  overdue: '#b91c1c',
  cancelled: '#64748b',
};

export const INVOICE_STATUS_LABELS: InvoiceStatusLabelConfig = {
  draft: 'Szkic',
  sent: 'Wysłana',
  paid: 'Opłacona',
  overdue: 'Zaległa',
  cancelled: 'Anulowana',
};

export const INVOICE_STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: 'draft', label: 'Szkic' },
  { value: 'sent', label: 'Wysłana' },
  { value: 'paid', label: 'Opłacona' },
  { value: 'overdue', label: 'Zaległa' },
  { value: 'cancelled', label: 'Anulowana' }
];

export const PAYMENT_METHOD_LABELS: InvoiceStatusLabelConfig = {
  cash: 'Gotówka',
  bank_transfer: 'Przelew',
  card: 'Karta',
  other: 'Inna',
};

/**
 * Returns the background color for a given invoice status
 */
export function getInvoiceStatusColor(status: InvoiceStatus | string): string {
  return INVOICE_STATUS_COLORS[status] || '#e2e8f0';
}

/**
 * Returns the text color for a given invoice status
 */
export function getInvoiceStatusTextColor(status: InvoiceStatus | string): string {
  return INVOICE_STATUS_TEXT_COLORS[status] || '#334155';
}

/**
 * Returns the CSS class for a given invoice status
 */
export function getInvoiceStatusClass(status: InvoiceStatus | string): string {
  return `status-${status}`;
}

/**
 * Returns the label for a given invoice status
 */
export function getInvoiceStatusLabel(status: InvoiceStatus | string): string {
  return INVOICE_STATUS_LABELS[status] || status;
}

/**
 * Returns the label for a given payment method
 */
export function getPaymentMethodLabel(method: string): string {
  return PAYMENT_METHOD_LABELS[method] || method;
}
