export interface ImportExportRecord {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  createdAt: string;
  source: string;
  amount: number;
}

export interface ExportJob {
  id: string;
  view: string;
  type: 'CSV' | 'JSON' | 'Excel';
  createdAt: string;
  status: 'ready' | 'scheduled' | 'failed';
  schedule?: string;
  fileName: string;
  rowCount: number;
  initiatedBy: string;
  description: string;
  entityId?: string;
  fields: string[];
}

export interface ExportField {
  key: string;
  label: string;
}

export interface ExportEntity {
  id: string;
  label: string;
  fields: ExportField[];
}

export interface ExportConfig {
  entityId: string;
  entityLabel: string;
  fields: string[];
  type: 'CSV' | 'JSON' | 'Excel';
  createdBy: string;
  schedule?: string;
}

export interface FieldMapping {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  source: string;
  amount: string;
}

export interface ImportField {
  key: keyof FieldMapping;
  label: string;
  placeholder: string;
}
