import { ChartConfiguration, ChartType } from 'chart.js';

/**
 * Default chart configuration templates for statistics dashboard
 */
export const CHART_CONFIGURATIONS = {
  ACTIVITY_TYPE: {
    type: 'doughnut' as ChartType,
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' as const }
      }
    }
  } as ChartConfiguration,

  INTENSITY: {
    type: 'pie' as ChartType,
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' as const }
      }
    }
  } as ChartConfiguration,

  DURATION_TREND: {
    type: 'line' as ChartType,
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Duration (minutes)' }
        }
      }
    }
  } as ChartConfiguration,

  GOAL_PROGRESS: {
    type: 'doughnut' as ChartType,
    data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  } as ChartConfiguration
};

/**
 * Chart color schemes
 */
export const CHART_COLORS = {
  WEEKLY_GOAL: ['#4caf50', '#e0e0e0'],
  MONTHLY_GOAL: ['#2196f3', '#e0e0e0']
};

/**
 * Goal targets for progress calculations
 */
export const GOAL_TARGETS = {
  WEEKLY_ACTIVITIES: 5,
  MONTHLY_ACTIVITIES: 20
} as const;
