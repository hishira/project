import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-document-name-cell',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './document-name-cell.component.html',
  styleUrls: ['./document-name-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentNameCellComponent {
  id = input.required<string>();
  name = input.required<string>();
  version = input<string | undefined>(undefined);
}
