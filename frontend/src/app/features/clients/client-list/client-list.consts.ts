import { ClientStatus } from "../client.model";

export const CLIENT_STATUSES: { value: ClientStatus; label: string }[] = [
  { value: 'active', label: 'Aktywny' },
  { value: 'inactive', label: 'Nieaktywny' },
  { value: 'lead', label: 'Potencjalny' },
  { value: 'former', label: 'Były' }
];

export const DISPLAYED_COLUMNS: string[] = ['name', 'taxId', 'mainContact', 'status', 'documents', 'lastContact', 'actions'];

