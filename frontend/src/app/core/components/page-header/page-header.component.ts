import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PageBackButtonComponent } from './page-back-button/page-back-button.component';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-header.component.html',
  standalone: true,
  imports: [MatToolbarModule, PageBackButtonComponent],
})
export class PageHeaderComponent {
  readonly withBackButtons = input<boolean>(true);
}
