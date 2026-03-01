export type DocumentType = 'contract' | 'annex' | 'specification' | 'protocol' | 'other';

export interface Document {
  id: string;
  name: string;                // nazwa pliku / tytuł
  type: DocumentType;
  clientId: string;            // ID klienta (powiązanie)
  clientName: string;          // dla wygody
  fileUrl: string;             // link do pliku (lub base64)
  fileSize: number;            // w bajtach
  mimeType: string;            // np. application/pdf
  uploadedAt: Date;
  uploadedBy: string;          // nazwa użytkownika
  description?: string;        // opcjonalny opis
  tags?: string[];
  version?: string;            // wersja dokumentu
  expiryDate?: Date;           // data ważności (np. umowy)
  // Pola specyficzne dla typów
  contractNumber?: string;     // dla umów
  annexTo?: string;            // ID dokumentu nadrzędnego (dla aneksów)
  approved?: boolean;          // czy zatwierdzony
}

// Uproszczona wersja dla listy
export interface DocumentListItem {
  id: string;
  name: string;
  type: DocumentType;
  clientName: string;
  uploadedAt: Date;
  fileSize: number;
  version?: string;
}