import { render, screen, fireEvent } from '@testing-library/angular';
import { OfferItemRowComponent } from './offer-item-row.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { vi } from 'vitest';

describe('OfferItemRowComponent', () => {
  let fb: FormBuilder;
  let createTestFormGroup: () => FormGroup;

  beforeEach(() => {
    fb = new FormBuilder();
    createTestFormGroup = () =>
      fb.group({
        id: ['test-id'],
        name: ['Test Product', Validators.required],
        description: ['Test description'],
        quantity: [10, [Validators.required, Validators.min(0.01)]],
        unit: ['szt', Validators.required],
        netPrice: [100, [Validators.required, Validators.min(0)]],
        discountPercent: [10, [Validators.min(0), Validators.max(100)]],
        vatRate: [23, [Validators.required, Validators.min(0), Validators.max(100)]],
        netAmount: [{ value: 900, disabled: true }],
        vatAmount: [{ value: 207, disabled: true }],
        grossAmount: [{ value: 1107, disabled: true }],
      });
  });

  const setup = async (itemGroup?: FormGroup, itemIndex: number = 0) => {
    const group = itemGroup || createTestFormGroup();
    const removeSpy = vi.fn();
    const recalcSpy = vi.fn();

    await render(OfferItemRowComponent, {
      componentProperties: {
        itemGroup: group,
        itemIndex: itemIndex,
        remove: { emit: removeSpy } as any,
        recalc: { emit: recalcSpy } as any,
      },
    });

    return { removeSpy, recalcSpy, itemGroup: group };
  };

  test('should display item position number', async () => {
    await setup(undefined, 0);
    expect(screen.getByText('Pozycja 1')).toBeInTheDocument();
  });

  test('should display correct position for second item', async () => {
    await setup(undefined, 1);
    expect(screen.getByText('Pozycja 2')).toBeInTheDocument();
  });

  test('should display delete button with tooltip', async () => {
    await setup();
    expect(screen.getByText('Usuń')).toBeInTheDocument();
  });

  test('should display form field labels', async () => {
    await setup();
    expect(screen.getByText('Nazwa')).toBeInTheDocument();
    expect(screen.getByText('Opis')).toBeInTheDocument();
    expect(screen.getByText('Ilość')).toBeInTheDocument();
    expect(screen.getByText('J.m.')).toBeInTheDocument();
    expect(screen.getByText('Cena netto')).toBeInTheDocument();
    expect(screen.getByText('Rabat %')).toBeInTheDocument();
    expect(screen.getByText('VAT %')).toBeInTheDocument();
  });

  test('should display readonly fields with labels', async () => {
    await setup();
    expect(screen.getByText('Netto:')).toBeInTheDocument();
    expect(screen.getByText('VAT:')).toBeInTheDocument();
    expect(screen.getByText('Brutto:')).toBeInTheDocument();
  });

  test('should display calculated values formatted to 2 decimal places', async () => {
    await setup();
    expect(screen.getByText('900.00')).toBeInTheDocument();
    expect(screen.getByText('207.00')).toBeInTheDocument();
    expect(screen.getByText('1,107.00')).toBeInTheDocument();
  });

  test('should emit remove event when delete button is clicked', async () => {
    const { removeSpy } = await setup(undefined, 2);
    const deleteButton = screen.getByRole('button', { name: /Usuń/i });
    fireEvent.click(deleteButton);
    expect(removeSpy).toHaveBeenCalledWith(2);
  });

  test('should emit recalc event when quantity input changes', async () => {
    const { recalcSpy } = await setup(undefined, 1);
    const quantityInput = screen.getByLabelText('Ilość');
    fireEvent.input(quantityInput, { target: { value: '15' } });
    expect(recalcSpy).toHaveBeenCalledWith(1);
  });

  test('should emit recalc event when net price input changes', async () => {
    const { recalcSpy } = await setup(undefined, 1);
    const netPriceInput = screen.getByLabelText('Cena netto');
    fireEvent.input(netPriceInput, { target: { value: '150' } });
    expect(recalcSpy).toHaveBeenCalledWith(1);
  });

  test('should emit recalc event when discount input changes', async () => {
    const { recalcSpy } = await setup(undefined, 1);
    const discountInput = screen.getByLabelText('Rabat %');
    fireEvent.input(discountInput, { target: { value: '20' } });
    expect(recalcSpy).toHaveBeenCalledWith(1);
  });

  test('should emit recalc event when VAT input changes', async () => {
    const { recalcSpy } = await setup(undefined, 1);
    const vatInput = screen.getByLabelText('VAT %');
    fireEvent.input(vatInput, { target: { value: '8' } });
    expect(recalcSpy).toHaveBeenCalledWith(1);
  });

  test('should populate form with initial values', async () => {
    await setup();
    const nameInput = screen.getByLabelText('Nazwa') as HTMLInputElement;
    expect(nameInput.value).toBe('Test Product');

    const quantityInput = screen.getByLabelText('Ilość') as HTMLInputElement;
    expect(quantityInput.value).toBe('10');
  });

  test('should display description field value', async () => {
    await setup();
    const descriptionInput = screen.getByLabelText('Opis') as HTMLInputElement;
    expect(descriptionInput.value).toBe('Test description');
  });
});
