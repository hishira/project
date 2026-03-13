import { Injectable, signal } from '@angular/core';
import { KpiDefinition, ReportDefinition, ReportResult, PredictionModel, ChurnPrediction, OpportunityPrediction, DashboardWidget } from './report.models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  // =============== KPI ===============
  private kpiData: KpiDefinition[] = [
    { id: 'revenue', label: 'Przychód (bieżący miesiąc)', value: 1250000, previousValue: 1120000, changePercent: 11.6, format: 'currency', icon: 'payments', color: '#4caf50' },
    { id: 'pipeline', label: 'Wartość pipeline', value: 3450000, previousValue: 2980000, changePercent: 15.8, format: 'currency', icon: 'trending_up', color: '#2196f3' },
    { id: 'churn', label: 'Wskaźnik odejść', value: 3.2, previousValue: 3.8, changePercent: -15.8, format: 'percent', icon: 'logout', color: '#f44336' },
    { id: 'ltv', label: 'LTV klienta (średnie)', value: 48500, previousValue: 45200, changePercent: 7.3, format: 'currency', icon: 'loyalty', color: '#ff9800' },
    { id: 'conversion', label: 'Konwersja lead → klient', value: 24.5, previousValue: 22.1, changePercent: 10.9, format: 'percent', icon: 'conversion_path', color: '#9c27b0' },
    { id: 'tickets', label: 'Otwarte tickety', value: 43, previousValue: 51, changePercent: -15.7, format: 'number', icon: 'support_agent', color: '#795548' }
  ];

  readonly kpis = signal<KpiDefinition[]>(this.kpiData);

  // =============== Raporty ===============
  private reportsData: ReportDefinition[] = [
    {
      id: 'r1',
      name: 'Sprzedaż miesięczna według produktów',
      description: 'Zestawienie przychodów z podziałem na produkty',
      type: 'sales',
      isSystem: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-02-15'),
      createdBy: 'System',
      config: {
        dataSource: 'invoices',
        measures: [{ field: 'totalGross', aggregation: 'sum', alias: 'Przychód' }],
        dimensions: [{ field: 'items.name', alias: 'Produkt' }],
        filters: [],
        chartType: 'bar',
        sort: [{ field: 'Przychód', order: 'desc' }]
      },
      lastRun: new Date('2025-03-10'),
      isFavorite: true,
      tags: ['sprzedaż', 'produkty']
    },
    {
      id: 'r2',
      name: 'Analiza ticketów według priorytetu',
      description: 'Liczba zgłoszeń w podziale na priorytety',
      type: 'support',
      isSystem: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-02-10'),
      createdBy: 'System',
      config: {
        dataSource: 'tickets',
        measures: [{ field: 'id', aggregation: 'count', alias: 'Liczba' }],
        dimensions: [{ field: 'priority', alias: 'Priorytet' }],
        filters: [{ field: 'status', operator: 'neq', value: 'closed' }],
        chartType: 'pie'
      },
      lastRun: new Date('2025-03-09'),
      isFavorite: false
    },
    {
      id: 'r3',
      name: 'Wartość pipeline według etapu',
      description: 'Suma wartości ofert na poszczególnych etapach',
      type: 'sales',
      isSystem: false,
      createdAt: new Date('2025-02-20'),
      updatedAt: new Date('2025-03-01'),
      createdBy: 'Jan Kowalski',
      config: {
        dataSource: 'opportunities',
        measures: [{ field: 'value', aggregation: 'sum', alias: 'Wartość' }],
        dimensions: [{ field: 'stage', alias: 'Etap' }],
        filters: [],
        chartType: 'bar'
      },
      lastRun: new Date('2025-03-10'),
      isFavorite: true
    },
    {
      id: 'r4',
      name: 'Kampanie marketingowe – współczynniki otwarć',
      description: 'Analiza skuteczności kampanii e-mail',
      type: 'marketing',
      isSystem: false,
      createdAt: new Date('2025-02-25'),
      updatedAt: new Date('2025-03-05'),
      createdBy: 'Anna Nowak',
      config: {
        dataSource: 'campaigns',
        measures: [
          { field: 'stats.recipients', aggregation: 'sum', alias: 'Odbiorcy' },
          { field: 'stats.opened', aggregation: 'sum', alias: 'Otwarci' }
        ],
        dimensions: [{ field: 'name', alias: 'Kampania' }],
        filters: [],
        chartType: 'bar'
      },
      lastRun: new Date('2025-03-08'),
      isFavorite: false
    }
  ];

  readonly reports = signal<ReportDefinition[]>(this.reportsData);

  // =============== Analityka predykcyjna ===============
  private predictionModelsData: PredictionModel[] = [
    { id: 'p1', name: 'Churn prediction', type: 'churn', accuracy: 0.87, lastTrained: new Date('2025-03-01'), status: 'active' },
    { id: 'p2', name: 'Win probability', type: 'opportunity', accuracy: 0.82, lastTrained: new Date('2025-03-05'), status: 'active' },
    { id: 'p3', name: 'LTV prediction', type: 'ltv', accuracy: 0.79, lastTrained: new Date('2025-02-20'), status: 'active' }
  ];

  private churnPredictionsData: ChurnPrediction[] = [
    { clientId: 'c1', clientName: 'Firma Alfa', probability: 0.82, riskLevel: 'high', predictedDate: new Date('2025-04-15'), keyFactors: [{ factor: 'Spadek aktywności', impact: 0.6 }, { factor: 'Zaległe płatności', impact: 0.4 }] },
    { clientId: 'c2', clientName: 'Beta Solutions', probability: 0.35, riskLevel: 'low', predictedDate: new Date('2025-06-01'), keyFactors: [{ factor: 'Niska wartość zamówień', impact: 0.3 }] },
    { clientId: 'c3', clientName: 'Gamma Sp. z o.o.', probability: 0.67, riskLevel: 'medium', predictedDate: new Date('2025-05-10'), keyFactors: [{ factor: 'Spadek satysfakcji', impact: 0.5 }, { factor: 'Konkurencja', impact: 0.3 }] }
  ];

  private opportunityPredictionsData: OpportunityPrediction[] = [
    { opportunityId: 'o1', opportunityName: 'Wdrożenie CRM', winProbability: 0.75, expectedRevenue: 120000, predictedCloseDate: new Date('2025-04-30') },
    { opportunityId: 'o2', opportunityName: 'Dostawa soków', winProbability: 0.9, expectedRevenue: 45000, predictedCloseDate: new Date('2025-03-25') },
    { opportunityId: 'o3', opportunityName: 'Rozszerzenie licencji', winProbability: 0.45, expectedRevenue: 30000, predictedCloseDate: new Date('2025-05-15') }
  ];

  readonly predictionModels = signal<PredictionModel[]>(this.predictionModelsData);
  readonly churnPredictions = signal<ChurnPrediction[]>(this.churnPredictionsData);
  readonly opportunityPredictions = signal<OpportunityPrediction[]>(this.opportunityPredictionsData);

  // =============== Dashboard (przykładowe widgety) ===============
  private dashboardWidgetsData: DashboardWidget[] = [
    { id: 'w1', type: 'kpi', title: 'Kluczowe wskaźniki', config: { kpiIds: ['revenue', 'pipeline', 'churn', 'ltv'] }, size: 'full', position: { row: 0, col: 0 }, refreshInterval: 3600 },
    { id: 'w2', type: 'chart', title: 'Sprzedaż wg produktów', config: { reportId: 'r1' }, size: 'medium', position: { row: 1, col: 0 } },
    { id: 'w3', type: 'prediction', title: 'Klienci zagrożeni odejściem', config: { limit: 5 }, size: 'medium', position: { row: 1, col: 1 } },
    { id: 'w4', type: 'trend', title: 'Trend przychodów', config: { period: 'month' }, size: 'large', position: { row: 2, col: 0 } }
  ];

  readonly dashboardWidgets = signal<DashboardWidget[]>(this.dashboardWidgetsData);

  // =============== Symulacja pobierania danych raportu ===============
  getReportData(reportId: string): ReportResult {
    // Symulacja – w rzeczywistości zapytanie do API
    console.log('Pobieranie danych dla raportu:', reportId);
    return {
      data: [
        { name: 'Produkt A', value: 45000 },
        { name: 'Produkt B', value: 38000 },
        { name: 'Produkt C', value: 52000 },
        { name: 'Produkt D', value: 29000 }
      ],
      total: 4,
      executionTime: 235
    };
  }

  // =============== Symulacje akcji ===============
  runReport(reportId: string) {
    console.log('Uruchamianie raportu:', reportId);
  }

  exportReport(reportId: string, format: 'pdf' | 'excel' | 'csv' | 'png') {
    console.log('Eksport raportu:', reportId, 'do formatu:', format);
  }

  saveReport(report: Partial<ReportDefinition>) {
    console.log('Zapisywanie raportu:', report);
  }

  deleteReport(reportId: string) {
    console.log('Usuwanie raportu:', reportId);
  }

  toggleFavorite(reportId: string) {
    console.log('Zmiana ulubionego raportu:', reportId);
  }
}