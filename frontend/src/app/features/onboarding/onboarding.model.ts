export type TaskStatus = 'pending' | 'completed' | 'skipped';
export type MaterialType = 'article' | 'video' | 'presentation' | 'link';

export interface OnboardingTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
  dueDays?: number; // liczba dni od startu onboardingu
  completedAt?: Date;
}

export interface TrainingMaterial {
  id: string;
  title: string;
  type: MaterialType;
  url: string;
  duration?: number; // w minutach dla filmów
  required: boolean;
  viewedByClient: boolean;
  viewedAt?: Date;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  scheduledAt: Date;
  duration: number; // minuty
  host: string;
  recordingUrl?: string;
  registered: boolean;
  attended?: boolean;
}

export interface ClientOnboarding {
  id: string;
  clientId: string;
  clientName: string;
  startDate: Date;
  endDate?: Date; // planowana data zakończenia
  status: 'in_progress' | 'completed' | 'overdue';
  tasks: OnboardingTask[];
  materials: TrainingMaterial[];
  webinars: Webinar[];
  progress: number; // % ukończenia
  createdAt: Date;
  updatedAt: Date;
}

// Uproszczony model dla listy
export interface OnboardingListItem {
  id: string;
  clientName: string;
  startDate: Date;
  progress: number;
  status: 'in_progress' | 'completed' | 'overdue';
}