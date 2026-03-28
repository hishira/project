import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-name-cell',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-name-cell.component.html',
  styleUrls: ['./project-name-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNameCellComponent {
  projectId = input.required<string>();
  projectName = input.required<string>();
}
