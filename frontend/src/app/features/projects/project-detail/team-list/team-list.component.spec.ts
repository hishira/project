import { render, screen, fireEvent } from '@testing-library/angular';
import { TeamListComponent } from './team-list.component';
import { ProjectTeamMember } from '../../project.model';
import { describe, it, expect, vi } from 'vitest';

describe('TeamListComponent', () => {
  const mockTeam: ProjectTeamMember[] = [
    {
      userId: '1',
      fullName: 'Jan Kowalski',
      role: 'Project Manager',
      avatarUrl: 'avatar1.jpg',
      allocation: 50,
    },
    {
      userId: '2',
      fullName: 'Anna Nowak',
      role: 'Developer',
      avatarUrl: 'avatar2.jpg',
      allocation: 100,
    },
  ];

  const setup = async (team?: ProjectTeamMember[]) => {
    const addMemberSpy = vi.fn();
    
    await render(TeamListComponent, {
      componentProperties: {
        team: team || mockTeam,
        addMember: {
          emit: addMemberSpy,
        } as any,
      },
    });

    return { addMemberSpy };
  };

  it('should display header "Zespół projektowy"', async () => {
    await setup();
    expect(screen.getByText('Zespół projektowy')).toBeInTheDocument();
  });

  it('should display "Dodaj członka" button', async () => {
    await setup();
    expect(screen.getByText('Dodaj członka')).toBeInTheDocument();
  });

  it('should emit addMember event when "Dodaj członka" is clicked', async () => {
    const { addMemberSpy } = await setup();
    const button = screen.getByText('Dodaj członka');
    fireEvent.click(button);
    expect(addMemberSpy).toHaveBeenCalled();
  });

  it('should display team members', async () => {
    await setup();
    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
    expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
  });

  it('should display member roles', async () => {
    await setup();
    expect(screen.getByText('Project Manager')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('should display member allocation percentages', async () => {
    await setup();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should display member avatars', async () => {
    await setup();
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'avatar1.jpg');
    expect(images[1]).toHaveAttribute('src', 'avatar2.jpg');
  });

  it('should handle empty team', async () => {
    await setup([]);
    expect(screen.queryByText('Jan Kowalski')).not.toBeInTheDocument();
  });
});
