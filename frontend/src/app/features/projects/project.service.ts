import { Injectable, signal } from '@angular/core';
import { Project, ProjectStatus } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projectsData: Project[] = [
    {
      id: 'p1',
      name: 'Wdrożenie CRM dla Tymbark',
      description: 'Implementacja systemu CRM, migracja danych, szkolenia.',
      clientId: 'c1',
      clientName: 'Tymbark Sp. z o.o.',
      status: 'active',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-06-30'),
      budget: {
        total: 250000,
        spent: 98000,
        currency: 'PLN',
        items: [
          { id: 'bi1', name: 'Konsultacje', planned: 50000, actual: 52000 },
          { id: 'bi2', name: 'Programowanie', planned: 120000, actual: 40000 },
          { id: 'bi3', name: 'Szkolenia', planned: 30000, actual: 6000 },
          { id: 'bi4', name: 'Licencje', planned: 50000, actual: 0 }
        ]
      },
      team: [
        { userId: 'u1', fullName: 'Jan Kowalski', role: 'Project Manager', avatarUrl: 'https://i.pravatar.cc/40?u=1', allocation: 50 },
        { userId: 'u2', fullName: 'Anna Nowak', role: 'Konsultant', avatarUrl: 'https://i.pravatar.cc/40?u=2', allocation: 100 },
        { userId: 'u3', fullName: 'Piotr Wiśniewski', role: 'Developer', avatarUrl: 'https://i.pravatar.cc/40?u=3', allocation: 80 }
      ],
      tasks: [
        { id: 'pt1', title: 'Analiza wymagań', status: 'done', assigneeId: 'u2', assigneeName: 'Anna Nowak', estimatedHours: 40, actualHours: 42, dueDate: new Date('2025-02-15') },
        { id: 'pt2', title: 'Konfiguracja systemu', status: 'in_progress', assigneeId: 'u3', assigneeName: 'Piotr Wiśniewski', estimatedHours: 120, actualHours: 60, dueDate: new Date('2025-04-10') },
        { id: 'pt3', title: 'Migracja danych', status: 'todo', assigneeId: 'u3', assigneeName: 'Piotr Wiśniewski', estimatedHours: 80, dueDate: new Date('2025-05-01') }
      ],
      milestones: [
        { id: 'm1', name: 'Kick-off', dueDate: new Date('2025-02-01'), completed: true, completedAt: new Date('2025-02-01') },
        { id: 'm2', name: 'Zakończenie analizy', dueDate: new Date('2025-02-28'), completed: true, completedAt: new Date('2025-02-27') },
        { id: 'm3', name: 'Pierwszy prototyp', dueDate: new Date('2025-04-15'), completed: false },
        { id: 'm4', name: 'Wdrożenie produkcyjne', dueDate: new Date('2025-06-15'), completed: false }
      ],
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-03-01')
    },
    {
      id: 'p2',
      name: 'Aplikacja mobilna dla Capri-Sun',
      description: 'Aplikacja do zarządzania zamówieniami dla przedstawicieli.',
      clientId: 'c2',
      clientName: 'Capri-Sun Polska',
      status: 'planned',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-10-31'),
      budget: {
        total: 180000,
        spent: 0,
        currency: 'PLN',
        items: [
          { id: 'bi5', name: 'Projekt UI/UX', planned: 30000, actual: 0 },
          { id: 'bi6', name: 'Backend', planned: 80000, actual: 0 },
          { id: 'bi7', name: 'Frontend', planned: 70000, actual: 0 }
        ]
      },
      team: [
        { userId: 'u1', fullName: 'Jan Kowalski', role: 'Project Manager', allocation: 30 },
        { userId: 'u4', fullName: 'Magdalena Zając', role: 'UI/UX Designer', avatarUrl: 'https://i.pravatar.cc/40?u=4', allocation: 100 }
      ],
      tasks: [],
      milestones: [
        { id: 'm5', name: 'Rozpoczęcie', dueDate: new Date('2025-07-01'), completed: false }
      ],
      createdAt: new Date('2025-03-10'),
      updatedAt: new Date('2025-03-10')
    },
    {
      id: 'p3',
      name: 'Integracja API dla Pepsi',
      description: 'Integracja systemu CRM z ERP klienta.',
      clientId: 'c3',
      clientName: 'PepsiCo Polska',
      status: 'active',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-05-30'),
      budget: {
        total: 95000,
        spent: 45000,
        currency: 'PLN',
        items: [
          { id: 'bi8', name: 'Analiza', planned: 15000, actual: 18000 },
          { id: 'bi9', name: 'Implementacja', planned: 60000, actual: 27000 },
          { id: 'bi10', name: 'Testy', planned: 20000, actual: 0 }
        ]
      },
      team: [
        { userId: 'u5', fullName: 'Tomasz Nowicki', role: 'Architekt', avatarUrl: 'https://i.pravatar.cc/40?u=5', allocation: 60 },
        { userId: 'u3', fullName: 'Piotr Wiśniewski', role: 'Developer', allocation: 40 }
      ],
      tasks: [
        { id: 'pt4', title: 'Projekt interfejsów', status: 'done', assigneeId: 'u5', assigneeName: 'Tomasz Nowicki', estimatedHours: 30, actualHours: 28, dueDate: new Date('2025-03-20') },
        { id: 'pt5', title: 'Implementacja endpointów', status: 'in_progress', assigneeId: 'u3', assigneeName: 'Piotr Wiśniewski', estimatedHours: 100, actualHours: 45, dueDate: new Date('2025-04-30') }
      ],
      milestones: [
        { id: 'm6', name: 'Akceptacja projektu', dueDate: new Date('2025-03-25'), completed: true },
        { id: 'm7', name: 'Wdrożenie', dueDate: new Date('2025-05-30'), completed: false }
      ],
      createdAt: new Date('2025-02-20'),
      updatedAt: new Date('2025-03-12')
    }
  ];

  readonly projects = signal<Project[]>(this.projectsData);

  getProjectById(id: string): Project | undefined {
    return this.projects().find(p => p.id === id);
  }

  getProjectsByStatus(status: ProjectStatus): Project[] {
    return this.projects().filter(p => p.status === status);
  }

  // Symulacja akcji
  addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    console.log('Dodawanie projektu:', project);
  }

  updateProject(id: string, changes: Partial<Project>) {
    console.log('Aktualizacja projektu:', id, changes);
  }

  deleteProject(id: string) {
    console.log('Usuwanie projektu:', id);
  }
}