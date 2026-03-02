export type ClientStatus = 'active' | 'inactive' | 'lead' | 'former';

export interface Client {
  id: string;
  name: string;               // pełna nazwa firmy
  shortName?: string;          // nazwa skrócona
  taxId?: string;              // NIP
  regon?: string;
  industry?: string;           // branża
  website?: string;
  phone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: ClientStatus;
  contacts?: ContactPerson[];  // osoby kontaktowe
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;         // ID opiekuna (handlowca)
  tags?: string[];
  // Pola agregowane (do wyświetlania na listach)
  mainContactName?: string;    // główna osoba kontaktowa
  documentsCount?: number;     // liczba dokumentów
  lastContactDate?: Date;      // ostatnia interakcja
}

export interface ContactPerson {
  id: string;
  clientId: string;
  fullName: string;
  position?: string;
  phone?: string;
  email?: string;
  isPrimary: boolean;          // czy główny kontakt
  notes?: string;
}