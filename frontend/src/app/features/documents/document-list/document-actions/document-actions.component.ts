import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-document-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink],
  templateUrl: './document-actions.component.html',
  styleUrls: ['./document-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentActionsComponent {
  id = input.required<string>();
  approved = input<boolean>(false);
}
