import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Milestone } from '../../project.model';

@Component({
  selector: 'app-milestones-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './milestones-list.component.html',
  styleUrls: ['./milestones-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilestonesListComponent {
  milestones = input.required<Milestone[]>();
  addMilestone = output<void>();
}
