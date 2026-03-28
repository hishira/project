import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink],
  templateUrl: './project-actions.component.html',
  styleUrls: ['./project-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectActionsComponent {
  projectId = input.required<string>();

  viewDetails = output<void>();
  edit = output<void>();
}
