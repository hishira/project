export type ProjectStatus = 'planned' | 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date; // planowana data zakończenia
  actualEndDate?: Date;
  budget: Budget;
  team: ProjectTeamMember[];
  tasks: ProjectTask[];
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  total: number;          // planowany całkowity budżet
  spent: number;          // wydane
  currency: string;       // np. 'PLN'
  items?: BudgetItem[];   // opcjonalnie pozycje
}

export interface BudgetItem {
  id: string;
  name: string;
  planned: number;
  actual: number;
}

export interface ProjectTeamMember {
  userId: string;
  fullName: string;
  role: string;           // np. 'Project Manager', 'Developer'
  avatarUrl?: string;
  allocation: number;     // procent zaangażowania
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  assigneeId?: string;
  assigneeName?: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
}