import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ProjectStatus } from '../../project.model';

@Component({
  selector: 'app-project-status-chip',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './project-status-chip.component.html',
  styleUrls: ['./project-status-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStatusChipComponent {
  status = input.required<ProjectStatus>();

  getStatusClass(status: ProjectStatus): string {
    const map: Record<ProjectStatus, string> = {
      planned: 'status-planned',
      active: 'status-active',
      on_hold: 'status-on-hold',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return map[status];
  }

  getStatusLabel(status: ProjectStatus): string {
    const map: Record<ProjectStatus, string> = {
      planned: 'Planowany',
      active: 'Aktywny',
      on_hold: 'Wstrzymany',
      completed: 'Zakończony',
      cancelled: 'Anulowany'
    };
    return map[status];
  }
}
