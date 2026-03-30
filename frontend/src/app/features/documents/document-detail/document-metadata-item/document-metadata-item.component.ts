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
  icon = input.required<string>();
  label = input.required<string>();
  value = input<string | null | undefined>('');
  isExpired = input<boolean>(false);
}
