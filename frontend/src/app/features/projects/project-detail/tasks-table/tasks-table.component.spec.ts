import { render, screen, fireEvent } from '@testing-library/angular';
import { TasksTableComponent } from './tasks-table.component';
import { ProjectTask } from '../../project.model';
import { describe, it, expect, vi } from 'vitest';

describe('TasksTableComponent', () => {
  const mockTasks: ProjectTask[] = [
    {
      id: '1',
      title: 'Zadanie 1',
      description: 'Opis zadania 1',
      status: 'todo',
      assigneeId: '1',
      assigneeName: 'Jan Kowalski',
      estimatedHours: 8,
      actualHours: 6,
      dueDate: new Date('2024-03-15'),
    },
    {
      id: '2',
      title: 'Zadanie 2',
      description: 'Opis zadania 2',
      status: 'in_progress',
      assigneeId: '2',
      assigneeName: 'Anna Nowak',
      estimatedHours: 16,
      actualHours: 10,
      dueDate: new Date('2024-03-20'),
    },
    {
      id: '3',
      title: 'Zadanie 3',
      description: 'Opis zadania 3',
      status: 'done',
      assigneeId: '1',
      assigneeName: 'Jan Kowalski',
      estimatedHours: 4,
      actualHours: 4,
      dueDate: new Date('2024-03-10'),
    },
  ];

  const setup = async (tasks?: ProjectTask[]) => {
    const addTaskSpy = vi.fn();
    const editTaskSpy = vi.fn();
    
    await render(TasksTableComponent, {
      componentProperties: {
        tasks: tasks || mockTasks,
        addTask: { emit: addTaskSpy } as any,
        editTask: { emit: editTaskSpy } as any,
      },
    });

    return { addTaskSpy, editTaskSpy };
  };

  it('should display header "Lista zadań"', async () => {
    await setup();
    expect(screen.getByText('Lista zadań')).toBeInTheDocument();
  });

  it('should display "Dodaj zadanie" button', async () => {
    await setup();
    expect(screen.getByText('Dodaj zadanie')).toBeInTheDocument();
  });

  it('should emit addTask event when "Dodaj zadanie" is clicked', async () => {
    const { addTaskSpy } = await setup();
    const button = screen.getByText('Dodaj zadanie');
    fireEvent.click(button);
    expect(addTaskSpy).toHaveBeenCalled();
  });

  it('should display table headers', async () => {
    await setup();
    expect(screen.getByText('Zadanie')).toBeInTheDocument();
    expect(screen.getByText('Przypisane')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Godziny (est/rzecz)')).toBeInTheDocument();
    expect(screen.getByText('Termin')).toBeInTheDocument();
  });

  it('should display tasks', async () => {
    await setup();
    expect(screen.getByText('Zadanie 1')).toBeInTheDocument();
    expect(screen.getByText('Zadanie 2')).toBeInTheDocument();
    expect(screen.getByText('Zadanie 3')).toBeInTheDocument();
  });

  it('should display assignee names', async () => {
    await setup();
    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
    expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
  });

  it('should display status labels in Polish', async () => {
    await setup();
    expect(screen.getByText('Do zrobienia')).toBeInTheDocument();
    expect(screen.getByText('W trakcie')).toBeInTheDocument();
    expect(screen.getByText('Zrobione')).toBeInTheDocument();
  });

  it('should display hours (estimated/actual)', async () => {
    await setup();
    expect(screen.getByText('8 / 6')).toBeInTheDocument();
    expect(screen.getByText('16 / 10')).toBeInTheDocument();
    expect(screen.getByText('4 / 4')).toBeInTheDocument();
  });

  it('should display due dates', async () => {
    await setup();
    expect(screen.getByText('15 mar')).toBeInTheDocument();
    expect(screen.getByText('20 mar')).toBeInTheDocument();
    expect(screen.getByText('10 mar')).toBeInTheDocument();
  });

  it('should display edit button for each task', async () => {
    await setup();
    const editButtons = screen.getAllByRole('button', { name: /Edytuj/i });
    expect(editButtons).toHaveLength(3);
  });

  it('should emit editTask event when edit button is clicked', async () => {
    const { editTaskSpy } = await setup();
    const editButtons = screen.getAllByRole('button', { name: /Edytuj/i });
    fireEvent.click(editButtons[0]);
    expect(editTaskSpy).toHaveBeenCalledWith('1');
  });

  it('should display "-" when assigneeName is not provided', async () => {
    const tasksWithoutAssignee: ProjectTask[] = [
      {
        id: '4',
        title: 'Zadanie bez przypisania',
        status: 'todo',
      } as ProjectTask,
    ];
    await setup(tasksWithoutAssignee);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should display 0 for hours when not provided', async () => {
    const tasksWithoutHours: ProjectTask[] = [
      {
        id: '4',
        title: 'Zadanie bez godzin',
        status: 'todo',
      } as ProjectTask,
    ];
    await setup(tasksWithoutHours);
    expect(screen.getByText('0 / 0')).toBeInTheDocument();
  });
});
