import { render, screen } from '@testing-library/angular';
import { ProjectStatusChipComponent } from './project-status-chip.component';
import { vi } from 'vitest';

describe('ProjectStatusChipComponent', () => {
  const statuses: Array<{ value: string; expectedLabel: string }> = [
    { value: 'planned', expectedLabel: 'Planowany' },
    { value: 'active', expectedLabel: 'Aktywny' },
    { value: 'on_hold', expectedLabel: 'Wstrzymany' },
    { value: 'completed', expectedLabel: 'Zakończony' },
    { value: 'cancelled', expectedLabel: 'Anulowany' },
  ];

  const setup = async (status: string, size: 'default' | 'large' = 'default') => {
    await render(ProjectStatusChipComponent, {
      inputs: {
        status,
        size,
      },
    });
  };

  describe('Status labels', () => {
    statuses.forEach(({ value, expectedLabel }) => {
      test(`should display "${expectedLabel}" for status "${value}"`, async () => {
        await setup(value);
        expect(screen.getByText(expectedLabel)).toBeInTheDocument();
      });
    });
  });

  describe('Status CSS classes', () => {
    statuses.forEach(({ value }) => {
      test(`should have correct CSS class for status "${value}"`, async () => {
        await setup(value);
        const chip = screen.getByRole('listitem');
        expect(chip).toHaveClass(`status-${value}`);
      });
    });
  });

  describe('Size variants', () => {
    test('should have default size by default', async () => {
      await setup('active');
      const chip = screen.getByRole('listitem');
      expect(chip).not.toHaveClass('status-chip-large');
    });

    test('should have large size when size="large"', async () => {
      await setup('active', 'large');
      const chip = screen.getByRole('listitem');
      expect(chip).toHaveClass('status-chip-large');
    });
  });
});
