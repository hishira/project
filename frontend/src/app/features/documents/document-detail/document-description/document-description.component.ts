import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-document-description',
  standalone: true,
  imports: [],
  templateUrl: './document-description.component.html',
  styleUrls: ['./document-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentDescriptionComponent {
  description = input.required<string>();
}
