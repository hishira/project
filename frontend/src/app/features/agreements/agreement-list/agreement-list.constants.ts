export type AgreementStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'DRAFT' | 'TERMINATED';

export const agreementStatusOptions: { value: AgreementStatus | ''; label: string }[] = [
  { value: '', label: 'Wszystkie' },
  { value: 'ACTIVE', label: 'Aktywne' },
  { value: 'PENDING', label: 'Oczekujące' },
  { value: 'DRAFT', label: 'Szkice' },
  { value: 'EXPIRED', label: 'Wygasłe' },
  { value: 'TERMINATED', label: 'Rozwiązane' }
];

export const agreementCategoryOptions: { value: string; label: string }[] = [
  { value: '', label: 'Wszystkie kategorie' },
  { value: 'SOFTWARE_LICENSE', label: 'Licencje oprogramowania' },
  { value: 'HARDWARE', label: 'Sprzęt' },
  { value: 'SERVICE', label: 'Usługi' },
  { value: 'SUBSCRIPTION', label: 'Subskrypcje' }
];

export const agreementStatusClassMap: Record<string, string> = {
  ACTIVE: 'status-active',
  PENDING: 'status-pending',
  DRAFT: 'status-draft',
  EXPIRED: 'status-expired',
  TERMINATED: 'status-terminated'
};

export const agreementStatusLabelMap: Record<string, string> = {
  ACTIVE: 'Aktywna',
  PENDING: 'Oczekująca',
  DRAFT: 'Szkic',
  EXPIRED: 'Wygasła',
  TERMINATED: 'Rozwiązana'
};

export function getAgreementStatusClass(status: string): string {
  return agreementStatusClassMap[status] || '';
}

export function getAgreementStatusLabel(status: string): string {
  return agreementStatusLabelMap[status] || status;
}
