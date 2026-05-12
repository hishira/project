import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { DocumentType } from '../../document.models';
import { getDocumentTypeIcon, getDocumentTypeLabel } from '../../document.utils';

@Component({
  selector: 'app-document-header',
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeaderComponent {
  readonly name = input.required<string>();
  readonly type = input.required<DocumentType | string>();
  readonly version = input<string | undefined>(undefined);
  readonly approved = input<boolean | undefined>(false);

  readonly getIcon = getDocumentTypeIcon;
  readonly getLabel = getDocumentTypeLabel;
}
