import { render, screen } from '@testing-library/angular';
import { RaportChartData } from './rarport-chart-data.component';
import { Chart } from 'chart.js';
import { vi } from 'vitest';

// Polyfill dla canvas – niezbędny w jsdom
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  canvas: {},
});

// --- Hoisted: definicje zmiennych przed mockiem ---
const { mockChartInstance, MockChart } = vi.hoisted(() => {
  const mockChartInstance = {
    destroy: vi.fn(),
    update: vi.fn(),
    data: { labels: [], datasets: [] },
  };

  // WAŻNE: używamy zwykłej funkcji, a nie arrow function – to musi być konstruktor!
  const MockChart = vi.fn(function(ctx: any, config: any) {
    // Tymczasowa implementacja – zostanie nadpisana w beforeEach
    return mockChartInstance;
  });

  return { mockChartInstance, MockChart };
});

// Mock modułu chart.js – używamy zdefiniowanego wyżej konstruktora
vi.mock('chart.js', () => ({
  Chart: MockChart,
}));

// Zmienna globalna do przechwytywania argumentów konstruktora
let chartConstructorArgs: any;

describe('RaportChartData', () => {
  const dashboardReport = {
    type: 'dashboard',
    data: {
      labels: ['Styczeń', 'Luty', 'Marzec'],
      datasets: [{ data: [10, 20, 30], label: 'Sprzedaż' }],
    },
    name: 'Wykres sprzedaży',
  };

  const otherReport = {
    type: 'other',
    data: {},
    name: 'Inny raport',
  };

  const invalidDashboardReport = {
    type: 'dashboard',
    data: { labels: null, datasets: [] },
  };

  const setup = async (report: any) => {
    return await render(RaportChartData, {
      componentInputs: { report },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    chartConstructorArgs = undefined;

    // Reset stanu instancji mocka
    mockChartInstance.destroy.mockClear();
    mockChartInstance.update.mockClear();
    mockChartInstance.data = { labels: [], datasets: [] };

    // Nadpisujemy implementację konstruktora, by przechwytywać config
    MockChart.mockImplementation(function(ctx: any, config: any) {
      chartConstructorArgs = config;
      return mockChartInstance;
    });
  });

  it('powinien wyświetlić komunikat o braku danych, gdy raport nie jest typu "dashboard"', async () => {
    await setup(otherReport);
    expect(screen.getByText(/Brak danych do wyświetlenia wykresu/i)).toBeInTheDocument();
    expect(document.querySelector('canvas')).not.toBeInTheDocument();
  });

  it('powinien wyrenderować canvas dla poprawnego raportu dashboard', async () => {
    await setup(dashboardReport);
    expect(document.querySelector('canvas')).toBeInTheDocument();
    expect(screen.queryByText(/Brak danych/i)).not.toBeInTheDocument();
  });

  it('powinien utworzyć instancję Chart po inicjalizacji widoku', async () => {
    await setup(dashboardReport);
    expect(MockChart).toHaveBeenCalledTimes(1);
    expect(chartConstructorArgs).toBeDefined();
    expect(chartConstructorArgs.data.labels).toEqual(dashboardReport.data.labels);
    expect(chartConstructorArgs.data.datasets).toEqual(dashboardReport.data.datasets);
  });

  it('powinien zaktualizować wykres po zmianie danych wejściowych', async () => {
    const { fixture } = await setup(dashboardReport);
    const updateSpy = mockChartInstance.update;

    const newReport = {
      ...dashboardReport,
      data: {
        labels: ['Kwiecień', 'Maj'],
        datasets: [{ data: [5, 15], label: 'Nowa sprzedaż' }],
      },
    };

    fixture.componentRef.setInput('report', newReport);
    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(updateSpy).toHaveBeenCalled();
    });

    expect(mockChartInstance.data.labels).toEqual(newReport.data.labels);
    expect(mockChartInstance.data.datasets).toEqual(newReport.data.datasets);
  });

  it('powinien zniszczyć wykres podczas niszczenia komponentu', async () => {
    const { fixture } = await setup(dashboardReport);
    const destroySpy = mockChartInstance.destroy;

    fixture.destroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  describe('metody pomocnicze', () => {
    it('isTableData – rozpoznaje tablicę obiektów', async () => {
      const { fixture } = await setup(otherReport);
      const comp = fixture.componentInstance;
      expect(comp.isTableData([{ a: 1 }])).toBe(true);
      expect(comp.isTableData([])).toBe(false);
      expect(comp.isTableData({})).toBe(false);
      expect(comp.isTableData(null)).toBe(false);
    });

    it('getTableColumns – zwraca klucze pierwszego obiektu', async () => {
      const { fixture } = await setup(otherReport);
      const comp = fixture.componentInstance;
      const data = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      expect(comp.getTableColumns(data)).toEqual(['id', 'name']);
      expect(comp.getTableColumns([])).toEqual([]);
    });

    it('isSummaryObject – rozpoznaje obiekt niebędący tablicą', async () => {
      const { fixture } = await setup(otherReport);
      const comp = fixture.componentInstance;
      expect(comp.isSummaryObject({ a: 1 })).toBe(true);
      expect(comp.isSummaryObject([])).toBe(false);
      expect(comp.isSummaryObject(null)).toBe(false);
    });

    it('downloadReport – wywołuje console.log i alert', async () => {
      const { fixture } = await setup(dashboardReport);
      const comp = fixture.componentInstance;
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      comp.downloadReport();
      expect(consoleSpy).toHaveBeenCalledWith('Pobieranie raportu:', dashboardReport);
      expect(alertSpy).toHaveBeenCalledWith(`Symulacja pobierania raportu: ${dashboardReport.name}`);
    });
  });

 it('dla nieprawidłowych danych dashboardu wykres nie jest tworzony', async () => {
  await setup(invalidDashboardReport);
  expect(MockChart).not.toHaveBeenCalled();
  expect(document.querySelector('canvas')).not.toBeInTheDocument();
  expect(screen.getByText(/Brak danych do wyświetlenia wykresu/i)).toBeInTheDocument();
});
});