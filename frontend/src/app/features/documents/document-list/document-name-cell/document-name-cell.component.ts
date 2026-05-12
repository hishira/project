import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-document-name-cell',
  imports: [RouterLink],
  templateUrl: './document-name-cell.component.html',
  styleUrls: ['./document-name-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentNameCellComponent {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly version = input<string | undefined>(undefined);
}
