import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-document-tags',
  imports: [MatChipsModule],
  templateUrl: './document-tags.component.html',
  styleUrls: ['./document-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTagsComponent {
  tags = input.required<string[]>();
}
