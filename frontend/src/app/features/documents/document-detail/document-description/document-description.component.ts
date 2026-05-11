import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-document-description',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './document-description.component.html',
  styleUrls: ['./document-description.component.scss'],
  standalone: true,
})
export class DocumentDescriptionComponent {
  readonly description = input.required<string>();
}
