import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProjectStatus } from '../../project.model';

@Component({
  selector: 'app-project-filters',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './project-filters.component.html',
  styleUrls: ['./project-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFiltersComponent {
  filterName = input<string>('');
  filterStatus = input<ProjectStatus | ''>('');
  statuses = input<{ value: ProjectStatus; label: string }[]>([]);

  filterNameChange = output<string>();
  filterStatusChange = output<ProjectStatus | ''>();
  clearFilters = output<void>();
}
