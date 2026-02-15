export interface Report<T = any> {
  /** Unikalny identyfikator raportu */
  id: string;

  /** Nazwa raportu (do wyświetlania) */
  name: string;

  /** Typ raportu – określa charakter danych */
  type: ReportType;

  /** Format, w jakim zapisane są dane */
  format: ReportFormat;

  /** Właściwe dane raportu – typ generyczny */
  data: T;

  /** Metadane raportu */
  metadata: ReportMetadata;

  /** Data wygenerowania */
  generatedAt: Date;

  /** Opcjonalna data ważności (np. dla danych tymczasowych) */
  expiresAt?: Date;
}

/** Metadane raportu */
export interface ReportMetadata {
  /** System źródłowy, z którego pochodzą dane */
  sourceSystem: 'crm' | 'product-management' | 'other' | string;

  /** Identyfikator użytkownika, który wygenerował raport */
  createdBy?: string;

  /** Parametry użyte do wygenerowania raportu (np. zakres dat, filtry) */
  parameters?: Record<string, any>;

  /** Wersja schematu danych lub wersja raportu */
  version?: string;

  /** Dodatkowe informacje specyficzne dla systemu */
  [key: string]: any;
}

/** Możliwe typy raportów */
export type ReportType =
  | 'dashboard'      // interaktywny dashboard (zwykle dane wizualne)
  | 'tabular'        // dane w formie tabeli
  | 'summary'        // podsumowanie, agregacja
  | 'detailed'       // szczegółowy wykaz
  | 'custom';        // niestandardowy

/** Możliwe formaty danych */
export type ReportFormat =
  | 'json'           // dane w formacie JSON (np. do wizualizacji)
  | 'pdf'            // dokument PDF
  | 'csv'            // dane w formacie CSV
  | 'xlsx'           // arkusz Excel
  | 'html'           // strona HTML
  | 'image';         // obraz (np. wykres)