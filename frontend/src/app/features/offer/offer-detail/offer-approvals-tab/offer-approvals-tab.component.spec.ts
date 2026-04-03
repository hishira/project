import { render, screen } from '@testing-library/angular';
import { OfferApprovalsTabComponent } from './offer-approvals-tab.component';
import { Approval } from '../../offer.model';

describe('OfferApprovalsTabComponent', () => {
  const mockApprovals: Approval[] = [
    {
      id: '1',
      status: 'pending',
      requestedBy: 'Jan Kowalski',
      requestedAt: new Date('2024-01-15T10:00:00'),
      reviewedBy: undefined,
      reviewedAt: undefined,
      comments: undefined,
    },
    {
      id: '2',
      status: 'approved',
      requestedBy: 'Anna Nowak',
      requestedAt: new Date('2024-01-16T11:00:00'),
      reviewedBy: 'Manager Test',
      reviewedAt: new Date('2024-01-16T15:00:00'),
      comments: 'Looks good',
    },
    {
      id: '3',
      status: 'rejected',
      requestedBy: 'Piotr Wiśniewski',
      requestedAt: new Date('2024-01-17T09:00:00'),
      reviewedBy: 'Manager Test',
      reviewedAt: new Date('2024-01-17T14:00:00'),
      comments: 'Needs revision',
    },
  ];

  const setup = async (approvals?: Approval[]) => {
    await render(OfferApprovalsTabComponent, {
      inputs: { approvals: approvals || mockApprovals },
    });
  };

  test('should display table headers', async () => {
    await setup();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Zgłaszający')).toBeInTheDocument();
    expect(screen.getByText('Data zgłoszenia')).toBeInTheDocument();
    expect(screen.getByText('Oceniający')).toBeInTheDocument();
    expect(screen.getByText('Data oceny')).toBeInTheDocument();
    expect(screen.getByText('Komentarz')).toBeInTheDocument();
  });

  test('should display approval statuses', async () => {
    await setup();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('approved')).toBeInTheDocument();
    expect(screen.getByText('rejected')).toBeInTheDocument();
  });

  test('should display requester names', async () => {
    await setup();
    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
    expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
    expect(screen.getByText('Piotr Wiśniewski')).toBeInTheDocument();
  });

  test('should display formatted request dates', async () => {
    await setup();
    expect(screen.getByText(/15 Jan 2024, 10:00/)).toBeInTheDocument();
    expect(screen.getByText(/16 Jan 2024, 11:00/)).toBeInTheDocument();
    expect(screen.getByText(/17 Jan 2024, 09:00/)).toBeInTheDocument();
  });

  test('should display reviewer names when available', async () => {
    await setup();
    const managerCells = screen.getAllByText('Manager Test');
    expect(managerCells.length).toBeGreaterThanOrEqual(2);
  });

  test('should display dash when reviewer is not available', async () => {
    await setup();
    const dashElements = screen.getAllByText('-');
    expect(dashElements.length).toBeGreaterThanOrEqual(1);
  });

  test('should display formatted review dates when available', async () => {
    await setup();
    expect(screen.getByText(/16 Jan 2024, 15:00/)).toBeInTheDocument();
    expect(screen.getByText(/17 Jan 2024, 14:00/)).toBeInTheDocument();
  });

  test('should display comments when available', async () => {
    await setup();
    expect(screen.getByText('Looks good')).toBeInTheDocument();
    expect(screen.getByText('Needs revision')).toBeInTheDocument();
  });

  test('should display dash when comments are not available', async () => {
    await setup();
    const dashElements = screen.getAllByText('-');
    expect(dashElements.length).toBeGreaterThanOrEqual(1);
  });

  test('should display empty state message when no approvals', async () => {
    await setup([]);
    expect(screen.getByText('Brak akceptacji')).toBeInTheDocument();
  });

  test('should display empty state with italic styling', async () => {
    await setup([]);
    const emptyState = screen.getByText('Brak akceptacji');
    expect(emptyState).toHaveStyle('font-style: italic');
  });
});
