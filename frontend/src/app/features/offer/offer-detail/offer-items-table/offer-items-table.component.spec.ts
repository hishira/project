import { render, screen } from '@testing-library/angular';
import { OfferItemsTableComponent } from './offer-items-table.component';
import { OfferItem } from '../../offer.model';

describe('OfferItemsTableComponent', () => {
  const mockItems: OfferItem[] = [
    {
      id: '1',
      name: 'Product A',
      description: 'Description A',
      quantity: 10,
      unit: 'szt',
      netPrice: 100,
      discountPercent: 10,
      vatRate: 23,
      netAmount: 900,
      vatAmount: 207,
      grossAmount: 1107,
    },
    {
      id: '2',
      name: 'Product B',
      description: 'Description B',
      quantity: 5,
      unit: 'kg',
      netPrice: 200,
      discountPercent: 0,
      vatRate: 8,
      netAmount: 1000,
      vatAmount: 80,
      grossAmount: 1080,
    },
  ];

  const setup = async (items?: OfferItem[]) => {
    await render(OfferItemsTableComponent, {
      inputs: { items: items || mockItems },
    });
  };

  test('should display "Pozycje oferty" header', async () => {
    await setup();
    expect(screen.getByText('Pozycje oferty')).toBeInTheDocument();
  });

  test('should display table headers', async () => {
    await setup();
    expect(screen.getByText('Nazwa')).toBeInTheDocument();
    expect(screen.getByText('Ilość')).toBeInTheDocument();
    expect(screen.getByText('Cena netto')).toBeInTheDocument();
    expect(screen.getByText('Rabat %')).toBeInTheDocument();
    expect(screen.getByText('VAT %')).toBeInTheDocument();
    expect(screen.getByText('Netto')).toBeInTheDocument();
    expect(screen.getByText('VAT')).toBeInTheDocument();
    expect(screen.getByText('Brutto')).toBeInTheDocument();
  });

  test('should display item names', async () => {
    await setup();
    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });

  test('should display item quantities with units', async () => {
    await setup();
    expect(screen.getByText('10 szt')).toBeInTheDocument();
    expect(screen.getByText('5 kg')).toBeInTheDocument();
  });

  test('should display net prices formatted to 2 decimal places', async () => {
    await setup();
    expect(screen.getByText('100.00')).toBeInTheDocument();
    expect(screen.getByText('200.00')).toBeInTheDocument();
  });

  test('should display discount percentages', async () => {
    await setup();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('should display VAT rates', async () => {
    await setup();
    expect(screen.getByText('23%')).toBeInTheDocument();
    expect(screen.getByText('8%')).toBeInTheDocument();
  });

  test('should display net amounts formatted to 2 decimal places', async () => {
    await setup();
    expect(screen.getByText('900.00')).toBeInTheDocument();
    expect(screen.getByText('1,000.00')).toBeInTheDocument();
  });

  test('should display VAT amounts formatted to 2 decimal places', async () => {
    await setup();
    expect(screen.getByText('207.00')).toBeInTheDocument();
    expect(screen.getByText('80.00')).toBeInTheDocument();
  });

  test('should display gross amounts formatted to 2 decimal places', async () => {
    await setup();
    expect(screen.getByText('1,107.00')).toBeInTheDocument();
    expect(screen.getByText('1,080.00')).toBeInTheDocument();
  });

  test('should display empty items list when no items provided', async () => {
    await setup([]);
    const rows = screen.queryAllByText('Product A');
    expect(rows).toHaveLength(0);
  });

  test('should display default discount of 0% when not provided', async () => {
    const itemsWithoutDiscount: OfferItem[] = [
      {
        id: '3',
        name: 'Product C',
        quantity: 1,
        unit: 'szt',
        netPrice: 50,
        vatRate: 23,
        netAmount: 50,
        vatAmount: 11.5,
        grossAmount: 61.5,
      },
    ];
    await setup(itemsWithoutDiscount);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
