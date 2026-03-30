import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DocumentType } from '../../document.models';
import { getDocumentTypeIcon, getDocumentTypeLabel } from '../../document.utils';

@Component({
  selector: 'app-document-header',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeaderComponent {
  name = input.required<string>();
  type = input.required<DocumentType | string>();
  version = input<string | undefined>(undefined);
  approved = input<boolean | undefined>(false);

  getIcon = getDocumentTypeIcon;
  getLabel = getDocumentTypeLabel;
}
