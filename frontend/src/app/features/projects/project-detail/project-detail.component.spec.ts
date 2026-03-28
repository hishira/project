import { render, screen } from '@testing-library/angular';
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectService } from '../project.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { Project } from '../project.model';
import { vi } from 'vitest';

// Mock serwisu
class MockProjectService {
  getProjectById = vi.fn();
}

// Mock ActivatedRoute
const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: vi.fn((key: string) => key === 'id' ? 'test-id' : null),
    },
  },
};

describe('ProjectDetailComponent', () => {
  const setup = async (options?: {
    project?: Project | undefined;
  }) => {
    const mockProjectService = new MockProjectService();
    
    if (options?.project !== undefined) {
      mockProjectService.getProjectById.mockReturnValue(options.project);
    } else {
      mockProjectService.getProjectById.mockReturnValue(undefined);
    }

    await render(ProjectDetailComponent, {
      providers: [
        { provide: ProjectService, useValue: mockProjectService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    return { mockProjectService };
  };

  test('should display header "Szczegóły projektu"', async () => {
    await setup();
    expect(screen.getByText('Szczegóły projektu')).toBeInTheDocument();
  });

  test('should call ProjectService.getProjectById with correct id on init', async () => {
    const { mockProjectService } = await setup();
    expect(mockProjectService.getProjectById).toHaveBeenCalledWith('test-id');
  });

  test('should display not found message when project is undefined', async () => {
    await setup({ project: undefined });
    expect(screen.getByText('Nie znaleziono projektu o podanym ID')).toBeInTheDocument();
    expect(screen.getByText('Powrót do listy')).toBeInTheDocument();
  });

  test('should display project details when project exists', async () => {
    const mockProject: Project = {
      id: 'test-id',
      name: 'Test Project',
      clientName: 'Test Client',
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: { total: 10000, spent: 5000, currency: 'PLN' },
      team: [],
      tasks: [],
      milestones: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setup({ project: mockProject });
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText(/Klient:/)).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
  });

  test('should display tabs for different sections', async () => {
    const mockProject: Project = {
      id: 'test-id',
      name: 'Test Project',
      clientName: 'Test Client',
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: { total: 10000, spent: 5000, currency: 'PLN' },
      team: [],
      tasks: [],
      milestones: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setup({ project: mockProject });
    
    expect(screen.getByText('Przegląd')).toBeInTheDocument();
    expect(screen.getByText('Zadania')).toBeInTheDocument();
    expect(screen.getByText('Harmonogram')).toBeInTheDocument();
    expect(screen.getByText('Budżet')).toBeInTheDocument();
    expect(screen.getByText('Raporty')).toBeInTheDocument();
  });
});
