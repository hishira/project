import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, input, OnDestroy, Signal, signal, viewChild } from "@angular/core";
import { Chart, ChartConfiguration, ChartData, ChartType } from "chart.js";
import { Report } from "../../../types";

@Component({
    selector: 'app-raport-chart-data',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './rarport-chart-data.component.html',
    imports: [],
    styles: [`
        .chart-container {
            height: 400px;
            width: 100%;
            position: relative;
        }
        canvas {
            height: 100%
        }
    `]
})
export class RaportChartData implements AfterViewInit, OnDestroy {
    readonly report = input.required<Report>();

    readonly chartCanvas: Signal<ElementRef<HTMLCanvasElement> | undefined> = viewChild<ElementRef<HTMLCanvasElement> | undefined>('chartCanvas');
    private chart: Chart | undefined;
    // Sygnały dla danych wykresu (używane tylko gdy report.type === 'dashboard')
    readonly chartData = signal<ChartData | null>(null);   // zamiast {} as ChartData
    readonly chartLabels = signal<string[]>([]);
    chartOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
    };
    chartType: ChartType = 'bar';

    constructor() {
        // Automatyczna aktualizacja wykresu przy zmianie raportu

        effect(() => {
            // Wywołaj aktualizację, gdy któryś z sygnałów się zmieni
            const currentReport = this.report();
            if (currentReport?.type === 'dashboard') {
                this.prepareChartData(currentReport.data);
                this.chartData();   // odczyt – wymusza reakcję
                this.chartLabels();
                this.updateChart();
            } else {
                this.chartData.set(null);
                this.chartLabels.set([]);
            }

        });
    }
    private updateChart(): void {
        if (!this.chart) return;
        const currentData = this.chartData();
        if (!currentData) {
            // opcjonalnie wyczyść wykres, ale chart.js może sobie poradzić z pustymi danymi
            this.chart.data.labels = [];
            this.chart.data.datasets = [];
        } else {
            this.chart.data.labels = this.chartLabels();
            this.chart.data.datasets = currentData.datasets;
        }
        this.chart.update();
    }


    /**
     * Przygotowuje dane do wykresu na podstawie surowego obiektu data.
     */
    private prepareChartData(data: any): void {
        if (data?.labels && Array.isArray(data.datasets)) {
            this.chartLabels.set(data.labels);
            this.chartData.set({
                labels: data.labels,
                datasets: data.datasets
            });
        } else {
            this.chartData.set(null);
            this.chartLabels.set([]);
        }
    }

    private createChart(): void {
        const ctx = this.chartCanvas()?.nativeElement?.getContext('2d');
        if (!ctx) return;

        const currentData = this.chartData();
        const data: ChartData = {
            labels: this.chartLabels(),
            datasets: currentData?.datasets ?? [], // bezpieczny dostęp
        };

        this.chart = new Chart(ctx, {
            type: this.chartType,
            data: data,
            options: this.chartOptions,
        });
    }

    ngAfterViewInit(): void {
        this.createChart();
    }

    ngOnDestroy(): void {
        this.chart?.destroy();
    }
    /**
     * Sprawdza, czy dane nadają się do wyświetlenia w tabeli.
     * (zgodność z logiką w szablonie)
     */
    isTableData(data: any): boolean {
        return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';
    }

    /**
     * Zwraca nazwy kolumn dla danych tabelarycznych.
     * UWAGA: Metoda wywoływana wielokrotnie w szablonie – w celach optymalizacyjnych
     * warto rozważyć obliczenie kolumn raz (patrz sugestie poniżej).
     */
    getTableColumns(data: any[]): string[] {
        if (data.length === 0) return [];
        return Object.keys(data[0]);
    }

    /**
     * Sprawdza, czy dane są obiektem (nie tablicą) – dla widoku podsumowania.
     */
    isSummaryObject(data: any): boolean {
        return data !== null && typeof data === 'object' && !Array.isArray(data);
    }

    /**
     * Symulacja pobierania raportu.
     */
    downloadReport(): void {
        const currentReport = this.report();
        if (currentReport) {
            console.log('Pobieranie raportu:', currentReport);
            alert(`Symulacja pobierania raportu: ${currentReport.name}`);
        }
    }
}