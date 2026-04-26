// raports-mock-data.ts

import { Report } from './types';

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
    data: [ /* dane klientów */],
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
    data: [ /* szczegóły */],
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
    data: { kpi: [ /* dane */] },
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
    data: [ /* dane wydatków */],
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

export const SAMPLE_REPORT_DETAILS: Report[] = [
  {
    id: 'rpt-001',
    name: 'Dashboard sprzedaży',
    type: 'dashboard',
    format: 'json',
    data: {
      labels: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec'],
      datasets: [
        {
          label: 'Sprzedaż (tys. PLN)',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    },
    metadata: {
      sourceSystem: 'crm',
      createdBy: 'jankowalski',
      parameters: { dateFrom: '2025-01-01', dateTo: '2025-06-30' }
    },
    generatedAt: new Date('2025-02-01T10:30:00')
  },
  {
    id: 'rpt-002',
    name: 'Lista klientów',
    type: 'tabular',
    format: 'csv',
    data: [
      { id: 1, name: 'Jan Kowalski', email: 'jan@example.com', region: 'Europa' },
      { id: 2, name: 'Anna Nowak', email: 'anna@example.com', region: 'Ameryka' },
      { id: 3, name: 'Piotr Wiśniewski', email: 'piotr@example.com', region: 'Azja' }
    ],
    metadata: {
      sourceSystem: 'crm',
      createdBy: 'annnowak',
      parameters: { region: 'wszystkie' }
    },
    generatedAt: new Date('2025-02-02T14:15:00')
  },
  {
    id: 'rpt-003',
    name: 'Podsumowanie kwartalne',
    type: 'summary',
    format: 'pdf',
    data: {
      revenue: 1250000,
      costs: 870000,
      profit: 380000,
      margin: 30.4,
      topProduct: 'Laptop XYZ',
      ordersCount: 1450
    },
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
    data: [
      { orderId: 'ORD-001', customer: 'Jan Kowalski', amount: 1250, status: 'zrealizowane', date: '2025-01-15' },
      { orderId: 'ORD-002', customer: 'Anna Nowak', amount: 3200, status: 'wysłane', date: '2025-01-17' },
      { orderId: 'ORD-003', customer: 'Piotr Wiśniewski', amount: 850, status: 'oczekujące', date: '2025-01-18' },
      { orderId: 'ORD-004', customer: 'Magdalena Zając', amount: 5600, status: 'zrealizowane', date: '2025-01-20' }
    ],
    metadata: {
      sourceSystem: 'crm',
      createdBy: 'magdalenaz',
      parameters: { status: 'wszystkie' }
    },
    generatedAt: new Date('2025-02-03T11:20:00')
  },
  {
    id: 'rpt-005',
    name: 'Wykres trendów',
    type: 'custom',
    format: 'image',
    data: { imageUrl: 'assets/sample-chart.png', description: 'Wykres trendów sprzedaży' },
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
    data: [
      { department: 'IT', employees: 45, newHires: 2, turnover: 1 },
      { department: 'Sprzedaż', employees: 32, newHires: 3, turnover: 2 },
      { department: 'Marketing', employees: 18, newHires: 1, turnover: 0 }
    ],
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
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Przychód (tys. PLN)',
          data: [420, 580, 630, 890],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Koszty (tys. PLN)',
          data: [310, 420, 450, 610],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    metadata: {
      sourceSystem: 'product-management',
      createdBy: 'adamN',
      version: '2.1'
    },
    generatedAt: new Date('2025-02-06T13:00:00')
  }
];