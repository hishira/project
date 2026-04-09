export type OnboardingStatus = 'in_progress' | 'completed' | 'overdue';

const statusLabels: Record<OnboardingStatus, string> = {
  in_progress: 'W trakcie',
  completed: 'Zakończony',
  overdue: 'Opóźniony'
};

const statusClasses: Record<OnboardingStatus, string> = {
  in_progress: 'status-in-progress',
  completed: 'status-completed',
  overdue: 'status-overdue'
};

const materialTypeIcons: Record<string, string> = {
  article: 'article',
  video: 'play_circle',
  presentation: 'slideshow',
  link: 'link'
};

export function getOnboardingStatusLabel(status: OnboardingStatus): string {
  return statusLabels[status] || status;
}

export function getOnboardingStatusClass(status: OnboardingStatus): string {
  return statusClasses[status] || '';
}

export function getMaterialTypeIcon(type: string): string {
  return materialTypeIcons[type] || 'description';
}
