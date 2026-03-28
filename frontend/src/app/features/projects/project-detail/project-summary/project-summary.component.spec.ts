import { render, screen } from '@testing-library/angular';
import { ProjectSummaryComponent } from './project-summary.component';
import { ProjectStatus } from '../../project.model';
import { vi } from 'vitest';

describe('ProjectSummaryComponent', () => {
  const defaultProps = {
    name: 'Test Project',
    status: 'active' as ProjectStatus,
    clientName: 'Test Client',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    budgetSpent: 5000,
    budgetTotal: 10000,
    budgetCurrency: 'PLN',
    progress: 50,
  };

  const setup = async (props?: Partial<typeof defaultProps>) => {
    const properties = { ...defaultProps, ...props };
    
    await render(ProjectSummaryComponent, {
      inputs: properties,
    });
  };

  test('should display project name', async () => {
    await setup();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  test('should display client name', async () => {
    await setup();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
  });

  test('should display status chip', async () => {
    await setup();
    expect(screen.getByText('Aktywny')).toBeInTheDocument();
  });

  test('should display budget information', async () => {
    await setup();
    expect(screen.getByText(/5,000/)).toBeInTheDocument();
    expect(screen.getByText(/10,000/)).toBeInTheDocument();
    expect(screen.getByText('PLN')).toBeInTheDocument();
  });

  test('should display progress percentage', async () => {
    await setup({ progress: 75 });
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('should display progress bars with correct values', async () => {
    await setup({ budgetSpent: 5000, budgetTotal: 10000, progress: 50 });
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(2);
  });

  test('should display date range', async () => {
    await setup();
    expect(screen.getByText(/01 Jan 2024/)).toBeInTheDocument();
    expect(screen.getByText(/31 Dec 2024/)).toBeInTheDocument();
  });

  test('should display description when provided', async () => {
    await setup({ description: 'Test description' });
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('should not display description when not provided', async () => {
    await setup({ description: undefined });
    const descriptionElements = screen.queryAllByText('Test description');
    expect(descriptionElements).toHaveLength(0);
  });

  test('should display "nieokreślony" when endDate is undefined', async () => {
    await setup({ endDate: undefined });
    expect(screen.getByText(/nieokreślony/)).toBeInTheDocument();
  });
});
