import { render, screen } from '@testing-library/angular';
import { BudgetTableComponent } from './budget-table.component';
import { BudgetItem } from '../../project.model';
import { describe, it, expect, vi } from 'vitest';

describe('BudgetTableComponent', () => {
  const mockItems: BudgetItem[] = [
    {
      id: '1',
      name: 'Licencje oprogramowania',
      planned: 5000,
      actual: 4500,
    },
    {
      id: '2',
      name: 'Usługi zewnętrzne',
      planned: 10000,
      actual: 12000,
    },
    {
      id: '3',
      name: 'Sprzęt',
      planned: 3000,
      actual: 3000,
    },
  ];

  const setup = async (items?: BudgetItem[], props?: Partial<{
    total: number;
    spent: number;
    currency: string;
  }>) => {
    const properties = {
      items: items || mockItems,
      total: props?.total ?? 18000,
      spent: props?.spent ?? 19500,
      currency: props?.currency ?? 'PLN',
    };
    
    await render(BudgetTableComponent, {
      componentProperties: properties,
    });

    return properties;
  };

  it('should display header "Pozycje budżetowe"', async () => {
    await setup();
    expect(screen.getByText('Pozycje budżetowe')).toBeInTheDocument();
  });

  it('should display table headers', async () => {
    await setup();
    expect(screen.getByText('Kategoria')).toBeInTheDocument();
    expect(screen.getByText('Planowane')).toBeInTheDocument();
    expect(screen.getByText('Rzeczywiste')).toBeInTheDocument();
    expect(screen.getByText('Odchylenie')).toBeInTheDocument();
  });

  it('should display budget items', async () => {
    await setup();
    expect(screen.getByText('Licencje oprogramowania')).toBeInTheDocument();
    expect(screen.getByText('Usługi zewnętrzne')).toBeInTheDocument();
    expect(screen.getByText('Sprzęt')).toBeInTheDocument();
  });

  it('should display planned amounts', async () => {
    await setup();
    expect(screen.getByText('5 000 PLN')).toBeInTheDocument();
    expect(screen.getByText('10 000 PLN')).toBeInTheDocument();
    expect(screen.getByText('3 000 PLN')).toBeInTheDocument();
  });

  it('should display actual amounts', async () => {
    await setup();
    expect(screen.getByText('4 500 PLN')).toBeInTheDocument();
    expect(screen.getByText('12 000 PLN')).toBeInTheDocument();
    expect(screen.getByText('3 000 PLN')).toBeInTheDocument();
  });

  it('should display variance (positive - under budget)', async () => {
    await setup();
    const varianceElement = screen.getByText('-500 PLN');
    expect(varianceElement).toHaveClass('positive');
  });

  it('should display variance (negative - over budget)', async () => {
    await setup();
    const varianceElement = screen.getByText('2 000 PLN');
    expect(varianceElement).toHaveClass('negative');
  });

  it('should display total summary', async () => {
    await setup();
    expect(screen.getByText('Razem planowane:')).toBeInTheDocument();
    expect(screen.getByText('Razem wydane:')).toBeInTheDocument();
    expect(screen.getByText('18 000 PLN')).toBeInTheDocument();
    expect(screen.getByText('19 500 PLN')).toBeInTheDocument();
  });

  it('should display empty state when no items', async () => {
    await setup([]);
    expect(screen.getByText('Brak szczegółowych pozycji budżetowych.')).toBeInTheDocument();
  });

  it('should handle zero variance', async () => {
    const itemsWithZeroVariance: BudgetItem[] = [
      {
        id: '4',
        name: 'Test',
        planned: 1000,
        actual: 1000,
      },
    ];
    await setup(itemsWithZeroVariance);
    const zeroVariance = screen.getByText('0 PLN');
    expect(zeroVariance).not.toHaveClass('positive');
    expect(zeroVariance).not.toHaveClass('negative');
  });

  it('should use provided currency', async () => {
    await setup(mockItems, { currency: 'EUR' });
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });
});
