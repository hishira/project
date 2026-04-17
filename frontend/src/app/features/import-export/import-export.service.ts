import { Injectable, signal } from '@angular/core';
import {
  ExportConfig,
  ExportEntity,
  ExportJob,
  FieldMapping,
  ImportExportRecord,
} from './import-export.model';

@Injectable({ providedIn: 'root' })
export class ImportExportService {
  readonly sampleRecords: ImportExportRecord[] = [
    {
      id: 'rec-001',
      name: 'Anna Kowalska',
      email: 'anna.kowalska@example.com',
      status: 'active',
      createdAt: '2026-04-08',
      source: 'CSV import',
      amount: 18450,
    },
    {
      id: 'rec-002',
      name: 'Jan Nowak',
      email: 'jan.nowak@example.com',
      status: 'pending',
      createdAt: '2026-04-07',
      source: 'CSV import',
      amount: 9400,
    },
    {
      id: 'rec-003',
      name: 'Maria Wiśniewska',
      email: 'maria.wisniewska@example.com',
      status: 'inactive',
      createdAt: '2026-04-05',
      source: 'Excel import',
      amount: 27500,
    },
    {
      id: 'rec-004',
      name: 'Tomasz Lewandowski',
      email: 'tomasz.lewandowski@example.com',
      status: 'active',
      createdAt: '2026-04-03',
      source: 'Manual import',
      amount: 15300,
    },
    {
      id: 'rec-005',
      name: 'Katarzyna Dąbrowska',
      email: 'katarzyna.dabrowska@example.com',
      status: 'archived',
      createdAt: '2026-04-01',
      source: 'CSV import',
      amount: 1200,
    },
  ];

  getSampleRecords(): ImportExportRecord[] {
    return [...this.sampleRecords];
  }

  readonly sampleExportJobs: ExportJob[] = [
    {
      id: 'exp-001',
      view: 'Lista klientów',
      type: 'CSV',
      createdAt: '2026-04-15 09:00',
      status: 'ready',
      fileName: 'clients-list-2026-04-15.csv',
      rowCount: 324,
      initiatedBy: 'Anna Kowalska',
      description: 'Eksport listy klientów z aktualnymi danymi.',
      fields: ['id', 'name', 'email', 'status', 'createdAt'],
    },
    {
      id: 'exp-002',
      view: 'Raport sprzedaży',
      type: 'JSON',
      createdAt: '2026-04-14 16:30',
      status: 'scheduled',
      schedule: 'Codziennie o 06:00',
      fileName: 'sales-report-2026-04-14.json',
      rowCount: 120,
      initiatedBy: 'Jan Nowak',
      description: 'Codzienny eksport sprzedaży jako JSON.',
      fields: ['id', 'name', 'status', 'amount', 'createdAt'],
    },
    {
      id: 'exp-003',
      view: 'Dokumenty do archiwizacji',
      type: 'Excel',
      createdAt: '2026-04-13 12:15',
      status: 'failed',
      fileName: 'archive-documents-2026-04-13.xlsx',
      rowCount: 48,
      initiatedBy: 'Maria Wiśniewska',
      description: 'Eksport dokumentów planowanych do archiwizacji.',
      fields: ['id', 'title', 'type', 'status'],
    },
  ];

  readonly exportJobs = signal<ExportJob[]>([...this.sampleExportJobs]);

  readonly exportEntities: ExportEntity[] = [
    {
      id: 'tickets',
      label: 'Tickety',
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Tytuł' },
        { key: 'status', label: 'Status' },
        { key: 'priority', label: 'Priorytet' },
        { key: 'createdAt', label: 'Utworzono' },
        { key: 'assignee', label: 'Przypisany' },
      ],
    },
    {
      id: 'agreements',
      label: 'Agreementy',
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nazwa' },
        { key: 'type', label: 'Typ' },
        { key: 'status', label: 'Status' },
        { key: 'validFrom', label: 'Rozpoczęcie' },
        { key: 'validTo', label: 'Zakończenie' },
      ],
    },
    {
      id: 'users',
      label: 'Użytkownicy',
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Imię i nazwisko' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Rola' },
        { key: 'createdAt', label: 'Data utworzenia' },
      ],
    },
    {
      id: 'clients',
      label: 'Klienci',
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nazwa' },
        { key: 'country', label: 'Kraj' },
        { key: 'status', label: 'Status' },
        { key: 'owner', label: 'Opiekun' },
      ],
    },
    {
      id: 'documents',
      label: 'Dokumenty',
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Tytuł' },
        { key: 'type', label: 'Typ' },
        { key: 'createdAt', label: 'Data utworzenia' },
        { key: 'status', label: 'Status' },
      ],
    },
    {
      id: 'invoices',
      label: 'Faktury',
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'number', label: 'Numer' },
        { key: 'amount', label: 'Kwota' },
        { key: 'issueDate', label: 'Data wystawienia' },
        { key: 'status', label: 'Status' },
      ],
    },
    {
      id: 'projects',
      label: 'Projekty',
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nazwa' },
        { key: 'owner', label: 'Właściciel' },
        { key: 'status', label: 'Status' },
        { key: 'deadline', label: 'Termin' },
      ],
    },
  ];

  getExportEntities(): ExportEntity[] {
    return [...this.exportEntities];
  }

  addExportJob(job: ExportJob): void {
    this.exportJobs.update((jobs) => [...jobs, job]);
  }

  getExportJobById(id: string): ExportJob | undefined {
    return this.exportJobs().find((job) => job.id === id);
  }

  createExportJob(config: ExportConfig): ExportJob {
    const now = new Date();
    const createdAt = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
    const fileName = `${config.entityId}-export-${now.toISOString().slice(0, 10)}.${config.type.toLowerCase()}`;
    const job: ExportJob = {
      id: `exp-${Math.floor(Math.random() * 900) + 100}`,
      view: `${config.entityLabel} (${config.type})`,
      type: config.type,
      createdAt,
      status: config.schedule ? 'scheduled' : 'ready',
      schedule: config.schedule,
      fileName,
      rowCount: Math.max(config.fields.length * 12, 20),
      initiatedBy: config.createdBy,
      description: `Eksport wybranych pól dla encji ${config.entityLabel}.`,
      entityId: config.entityId,
      fields: config.fields,
    };
    this.addExportJob(job);
    return job;
  }

  async parseCsvFile(file: File): Promise<string[][]> {
    const text = await this.readFileAsText(file);
    return this.parseCsv(text);
  }

  async parseExcelFile(file: File): Promise<string[][]> {
    throw new Error('Excel import nie jest dostępny w tym demo frontendowym.');
  }

  private parseCsv(text: string): string[][] {
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
    return lines.map((line) => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i += 1;
          } else {
            inQuotes = !inQuotes;
          }
          continue;
        }

        if (char === ',' && !inQuotes) {
          values.push(current);
          current = '';
          continue;
        }

        current += char;
      }

      values.push(current);
      return values.map((value) => value.trim());
    });
  }

  mapRows(rows: string[][], mapping: FieldMapping): ImportExportRecord[] {
    if (!rows.length) {
      return [];
    }

    const headers = rows[0].map((header) => header.toString().trim());
    const bodyRows = rows.slice(1).filter((row) => row.some((cell) => cell.toString().trim() !== ''));

    return bodyRows.map((row) => {
      const rowObject = headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = row[index]?.toString().trim() ?? '';
        return acc;
      }, {});

      return {
        id: rowObject[mapping.id] ?? '',
        name: rowObject[mapping.name] ?? '',
        email: rowObject[mapping.email] ?? '',
        status: (rowObject[mapping.status] ?? 'pending') as ImportExportRecord['status'],
        createdAt: rowObject[mapping.createdAt] ?? '',
        source: rowObject[mapping.source] ?? 'import',
        amount: Number(rowObject[mapping.amount] ?? '0'),
      };
    });
  }

  buildCsv(records: ImportExportRecord[]): string {
    const headers = ['ID', 'Name', 'Email', 'Status', 'CreatedAt', 'Source', 'Amount'];
    const rows = records.map((record) => [
      record.id,
      record.name,
      record.email,
      record.status,
      record.createdAt,
      record.source,
      record.amount.toString(),
    ]);

    const csvLines = [headers, ...rows].map((row) => row.map((value) => this.escapeCsvValue(value)).join(','));
    return csvLines.join('\n');
  }

  buildJson(records: ImportExportRecord[]): string {
    return JSON.stringify(records, null, 2);
  }

  private escapeCsvValue(value: string): string {
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  private async readFileAsText(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, 'UTF-8');
    });
  }

  async downloadFile(content: string, fileName: string, mimeType: string): Promise<void> {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
