import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentType } from '../../document.models';
import { getDocumentTypeIcon, getDocumentTypeLabel } from '../../document.utils';

@Component({
  selector: 'app-document-type-icon',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './document-type-icon.component.html',
  styleUrls: ['./document-type-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTypeIconComponent {
  type = input.required<DocumentType>();

  getIcon = getDocumentTypeIcon;
  getLabel = getDocumentTypeLabel;
}
