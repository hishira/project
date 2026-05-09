import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ProjectStatus } from '../../project.model';

const statusMap = {
  planned: 'status-planned',
  active: 'status-active',
  on_hold: 'status-on-hold',
  completed: 'status-completed',
  cancelled: 'status-cancelled'
};

const labelMap = {
  planned: 'Planowany',
  active: 'Aktywny',
  on_hold: 'Wstrzymany',
  completed: 'Zakończony',
  cancelled: 'Anulowany'
};

@Component({
  selector: 'app-project-status-chip',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './project-status-chip.component.html',
  styleUrls: ['./project-status-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStatusChipComponent {
  readonly status = input.required<ProjectStatus>();

  getStatusClass(status: ProjectStatus): string {
    return statusMap[status];
  }

  getStatusLabel(status: ProjectStatus): string {
    return labelMap[status];
  }
}
