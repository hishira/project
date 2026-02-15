// sample-reports.ts

import { Report } from "../types";

export const SAMPLE_REPORTS: Report[] = [
  {
    id: 'rpt-001',
    name: 'Dashboard sprzedaży',
    type: 'dashboard',
    format: 'json',
    data: { /* przykładowe dane dashboardu */ },
    metadata: {
      sourceSystem: 'crm',
      createdBy: 'jankowalski',
      parameters: { dateFrom: '2025-01-01', dateTo: '2025-01-31' },
      version: '1.0'
    },
    generatedAt: new Date('2025-02-01T10:30:00'),
    expiresAt: new Date('2025-03-01')
  },
  {
    id: 'rpt-002',
    name: 'Lista klientów',
    type: 'tabular',
    format: 'csv',
    data: [ /* dane klientów */ ],
    metadata: {
      sourceSystem: 'crm',
      createdBy: 'annnowak',
      parameters: { region: 'Europa' }
    },
    generatedAt: new Date('2025-02-02T14:15:00')
  },
  {
    id: 'rpt-003',
    name: 'Podsumowanie kwartalne',
    type: 'summary',
    format: 'pdf',
    data: { /* dane podsumowania */ },
    metadata: {
      sourceSystem: 'product-management',
      createdBy: 'piotrwisniewski',
      parameters: { quarter: 'Q4', year: 2024 }
    },
    generatedAt: new Date('2025-01-10T08:00:00')
  },
  {
    id: 'rpt-004',
    name: 'Szczegóły zamówień',
    type: 'detailed',
    format: 'xlsx',
    data: [ /* szczegóły */ ],
    metadata: {
      sourceSystem: 'crm',
      createdBy: 'magdalenaz',
      parameters: { status: 'completed' }
    },
    generatedAt: new Date('2025-02-03T11:20:00')
  },
  {
    id: 'rpt-005',
    name: 'Wykres trendów',
    type: 'custom',
    format: 'image',
    data: { chartUrl: 'assets/charts/trends.png' },
    metadata: {
      sourceSystem: 'other',
      createdBy: 'tomaszK',
      parameters: { metric: 'revenue' }
    },
    generatedAt: new Date('2025-01-28T16:45:00')
  },
  {
    id: 'rpt-006',
    name: 'Raport miesięczny HR',
    type: 'tabular',
    format: 'pdf',
    data: { /* dane hr */ },
    metadata: {
      sourceSystem: 'other',
      createdBy: 'ewaM',
      parameters: { month: '2025-01' }
    },
    generatedAt: new Date('2025-02-05T09:10:00')
  },
  {
    id: 'rpt-007',
    name: 'Dashboard KPI',
    type: 'dashboard',
    format: 'json',
    data: { kpi: [ /* dane */ ] },
    metadata: {
      sourceSystem: 'product-management',
      createdBy: 'adamN',
      version: '2.1'
    },
    generatedAt: new Date('2025-02-06T13:00:00')
  },
  {
    id: 'rpt-008',
    name: 'Zestawienie wydatków',
    type: 'summary',
    format: 'csv',
    data: [ /* dane wydatków */ ],
    metadata: {
      sourceSystem: 'crm',
      createdBy: 'katarzynaP',
      parameters: { department: 'IT' }
    },
    generatedAt: new Date('2025-01-30T12:00:00')
  },
  {
    id: 'rpt-009',
    name: 'Logi systemowe',
    type: 'detailed',
    format: 'html',
    data: '<table>...</table>',
    metadata: {
      sourceSystem: 'other',
      createdBy: 'system',
      parameters: { level: 'error' }
    },
    generatedAt: new Date('2025-02-07T07:25:00')
  },
  {
    id: 'rpt-010',
    name: 'Raport niestandardowy',
    type: 'custom',
    format: 'json',
    data: { custom: true },
    metadata: {
      sourceSystem: 'product-management',
      createdBy: 'marekL',
      parameters: { customParam: 'value' }
    },
    generatedAt: new Date('2025-02-07T18:30:00')
  }
];