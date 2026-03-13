// =============== Typy podstawowe ===============
export type KpiType = 'revenue' | 'pipeline' | 'churn' | 'ltv' | 'conversion' | 'tickets' | 'tasks';
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'radar';
export type DateRange = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisQuarter' | 'lastQuarter' | 'thisYear' | 'lastYear' | 'custom';

// =============== KPI ===============
export interface KpiDefinition {
  id: KpiType;
  label: string;
  value: number;
  previousValue?: number;
  changePercent?: number;
  format: 'currency' | 'number' | 'percent' | 'time';
  icon: string;
  color: string;
}

// =============== Raporty ===============
export interface ReportDefinition {
  id: string;
  name: string;
  description?: string;
  type: 'sales' | 'support' | 'marketing' | 'finance' | 'custom';
  isSystem: boolean; // czy raport systemowy (nie można edytować)
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  config: ReportConfig;
  lastRun?: Date;
  isFavorite: boolean;
  tags?: string[];
}

export interface ReportConfig {
  dataSource: string; // np. 'invoices', 'tickets', 'tasks'
  measures: ReportMeasure[];
  dimensions: ReportDimension[];
  filters: ReportFilter[];
  chartType: ChartType;
  sort?: { field: string; order: 'asc' | 'desc' }[];
  limit?: number;
}

export interface ReportMeasure {
  field: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  alias: string;
}

export interface ReportDimension {
  field: string;
  alias: string;
}

export interface ReportFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface ReportResult {
  data: any[];
  total: number;
  executionTime: number; // w ms
}

// =============== Analityka predykcyjna ===============
export interface PredictionModel {
  id: string;
  name: string;
  type: 'churn' | 'opportunity' | 'ltv' | 'nextBestAction';
  accuracy?: number; // 0-1
  lastTrained?: Date;
  status: 'active' | 'training' | 'inactive';
}

export interface ChurnPrediction {
  clientId: string;
  clientName: string;
  probability: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high';
  predictedDate?: Date;
  keyFactors: { factor: string; impact: number }[];
}

export interface OpportunityPrediction {
  opportunityId: string;
  opportunityName: string;
  winProbability: number;
  expectedRevenue: number;
  predictedCloseDate: Date;
}

// =============== Dashboard ===============
export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'prediction' | 'trend';
  title: string;
  config: any; // specyficzna konfiguracja widgeta
  size: 'small' | 'medium' | 'large' | 'full';
  position: { row: number; col: number };
  refreshInterval?: number; // w sekundach, 0 = ręczne
}

