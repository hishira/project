import { DocumentType } from './document.models';

export interface DocumentTypeIconConfig {
  [key: string]: string;
}

export interface DocumentTypeLabelConfig {
  [key: string]: string;
}

export const DOCUMENT_TYPE_ICONS: DocumentTypeIconConfig = {
  contract: 'description',
  annex: 'note_add',
  specification: 'science',
  protocol: 'assignment',
  other: 'insert_drive_file'
};

export const DOCUMENT_TYPE_LABELS: DocumentTypeLabelConfig = {
  contract: 'Umowa',
  annex: 'Aneks',
  specification: 'Specyfikacja',
  protocol: 'Protokół',
  other: 'Inny'
};

export const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: 'contract', label: 'Umowa' },
  { value: 'annex', label: 'Aneks' },
  { value: 'specification', label: 'Specyfikacja' },
  { value: 'protocol', label: 'Protokół' },
  { value: 'other', label: 'Inny' }
];

/**
 * Returns the icon for a given document type
 */
export function getDocumentTypeIcon(type: DocumentType): string {
  return DOCUMENT_TYPE_ICONS[type] || 'description';
}

/**
 * Returns the label for a given document type
 */
export function getDocumentTypeLabel(type: DocumentType): string {
  return DOCUMENT_TYPE_LABELS[type] || type;
}

/**
 * Formats file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
