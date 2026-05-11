import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-document-metadata-item',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './document-metadata-item.component.html',
  styleUrls: ['./document-metadata-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentMetadataItemComponent {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input<string | null | undefined>('');
  readonly isExpired = input<boolean>(false);
}
