import { render, screen } from '@testing-library/angular';
import { OfferVersionsTabComponent } from './offer-versions-tab.component';
import { OfferVersion } from '../../offer.model';

describe('OfferVersionsTabComponent', () => {
  const mockVersions: OfferVersion[] = [
    {
      version: 1,
      createdAt: new Date('2024-01-15T10:30:00'),
      createdBy: 'Jan Kowalski',
      changes: 'Initial version',
      data: {},
    },
    {
      version: 2,
      createdAt: new Date('2024-01-16T14:45:00'),
      createdBy: 'Anna Nowak',
      changes: 'Updated prices',
      data: {},
    },
  ];

  const setup = async (versions?: OfferVersion[]) => {
    await render(OfferVersionsTabComponent, {
      inputs: { versions: versions || mockVersions },
    });
  };

  test('should display table headers', async () => {
    await setup();
    expect(screen.getByText('Wersja')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Utworzył')).toBeInTheDocument();
    expect(screen.getByText('Zmiany')).toBeInTheDocument();
  });

  test('should display version numbers with "v" prefix', async () => {
    await setup();
    expect(screen.getByText('v1')).toBeInTheDocument();
    expect(screen.getByText('v2')).toBeInTheDocument();
  });

  test('should display formatted creation dates', async () => {
    await setup();
    expect(screen.getByText(/15 Jan 2024, 10:30/)).toBeInTheDocument();
    expect(screen.getByText(/16 Jan 2024, 14:45/)).toBeInTheDocument();
  });

  test('should display creator names', async () => {
    await setup();
    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
    expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
  });

  test('should display change descriptions', async () => {
    await setup();
    expect(screen.getByText('Initial version')).toBeInTheDocument();
    expect(screen.getByText('Updated prices')).toBeInTheDocument();
  });

  test('should display empty state message when no versions', async () => {
    await setup([]);
    expect(screen.getByText('Brak wersji')).toBeInTheDocument();
  });

  test('should display empty state with italic styling', async () => {
    await setup([]);
    const emptyState = screen.getByText('Brak wersji');
    expect(emptyState).toHaveStyle('font-style: italic');
  });
});
