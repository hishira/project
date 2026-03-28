import { render, screen, fireEvent } from '@testing-library/angular';
import { MilestonesListComponent } from './milestones-list.component';
import { Milestone } from '../../project.model';
import { vi } from 'vitest';

describe('MilestonesListComponent', () => {
  const mockMilestones: Milestone[] = [
    {
      id: '1',
      name: 'Kamień 1',
      dueDate: new Date('2024-06-01'),
      completed: false,
    },
    {
      id: '2',
      name: 'Kamień 2',
      dueDate: new Date('2024-09-01'),
      completed: true,
      completedAt: new Date('2024-08-28'),
    },
  ];

  const setup = async (milestones?: Milestone[]) => {
    const addMilestoneSpy = vi.fn();
    
    await render(MilestonesListComponent, {
      inputs: {
        milestones: milestones || mockMilestones,
        addMilestone: { emit: addMilestoneSpy } as any,
      },
    });

    return { addMilestoneSpy };
  };

  test('should display header "Kamienie milowe"', async () => {
    await setup();
    expect(screen.getByText('Kamienie milowe')).toBeInTheDocument();
  });

  test('should display "Dodaj kamień" button', async () => {
    await setup();
    expect(screen.getByText('Dodaj kamień')).toBeInTheDocument();
  });

  test('should emit addMilestone event when "Dodaj kamień" is clicked', async () => {
    const { addMilestoneSpy } = await setup();
    const button = screen.getByText('Dodaj kamień');
    fireEvent.click(button);
    expect(addMilestoneSpy).toHaveBeenCalled();
  });

  test('should display milestone names', async () => {
    await setup();
    expect(screen.getByText('Kamień 1')).toBeInTheDocument();
    expect(screen.getByText('Kamień 2')).toBeInTheDocument();
  });

  test('should display milestone due dates', async () => {
    await setup();
    expect(screen.getByText('01 cze 2024')).toBeInTheDocument();
    expect(screen.getByText('01 wrz 2024')).toBeInTheDocument();
  });

  test('should display correct icons for completed/incomplete milestones', async () => {
    await setup();
    expect(screen.getByText('radio_button_unchecked')).toBeInTheDocument();
    expect(screen.getByText('check_circle')).toBeInTheDocument();
  });

  test('should display completion date for completed milestones', async () => {
    await setup();
    expect(screen.getByText(/ukończono 28 sie/)).toBeInTheDocument();
  });

  test('should not display completion date for incomplete milestones', async () => {
    await setup();
    const completionDates = screen.queryAllByText(/ukończono/);
    expect(completionDates).toHaveLength(1);
  });

  test('should apply "completed" class to icon when milestone is completed', async () => {
    await setup();
    const completedIcon = screen.getByText('check_circle');
    expect(completedIcon).toHaveClass('completed');
  });

  test('should not apply "completed" class to icon when milestone is not completed', async () => {
    await setup();
    const incompleteIcon = screen.getByText('radio_button_unchecked');
    expect(incompleteIcon).not.toHaveClass('completed');
  });

  test('should handle empty milestones list', async () => {
    await setup([]);
    expect(screen.queryByText('Kamień 1')).not.toBeInTheDocument();
  });
});
