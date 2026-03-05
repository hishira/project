export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'task' | 'meeting' | 'note';
export type RelatedEntityType = 'client' | 'opportunity' | 'ticket';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;           // termin wykonania
  completedAt?: Date;       // data zakończenia
  assignedTo?: {            // osoba przypisana
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  createdBy: {
    id: string;
    fullName: string;
  };
  relatedTo?: {             // powiązanie z innym obiektem CRM
    type: RelatedEntityType;
    id: string;
    name: string;           // nazwa klienta / oferty / ticketa
  };
  reminder?: Date;          // data przypomnienia
  allDay?: boolean;         // czy całodniowe
  location?: string;        // miejsce spotkania (dla typu meeting)
}

// Uproszczony model dla widoku kalendarza
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  color?: string;           // kolor wg priorytetu lub typu
  task: Task;               // referencja do pełnego zadania
}