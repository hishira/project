import { render, screen } from '@testing-library/angular';
import { ProjectStatusChipComponent } from './project-status-chip.component';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Explicitly assign globals if not available
const _describe = (globalThis as any).describe || describe;
const _test = (globalThis as any).test || test;
const _expect = (globalThis as any).expect || expect;

_describe('ProjectStatusChipComponent', () => {
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

  _describe('Status labels', () => {
    statuses.forEach(({ value, expectedLabel }) => {
      _test(`should display "${expectedLabel}" for status "${value}"`, async () => {
        await setup(value);
        _expect(screen.getByText(expectedLabel)).toBeInTheDocument();
      });
    });
  });

  _describe('Status CSS classes', () => {
    statuses.forEach(({ value }) => {
      _test(`should have correct CSS class for status "${value}"`, async () => {
        await setup(value);
        const chip = screen.getByRole('chip');
        _expect(chip).toHaveClass(`status-${value}`);
      });
    });
  });

  _describe('Size variants', () => {
    _test('should have default size by default', async () => {
      await setup('active');
      const chip = screen.getByRole('chip');
      _expect(chip).not.toHaveClass('status-chip-large');
    });

    _test('should have large size when size="large"', async () => {
      await setup('active', 'large');
      const chip = screen.getByRole('chip');
      _expect(chip).toHaveClass('status-chip-large');
    });
  });
});
