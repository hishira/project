import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MainPageViewComponent } from '../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../core/components/page-header/page-header.component';
import { ReadonlyOnlyComponent } from '../../core/components/read-only/read-only.component';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, ReadonlyOnlyComponent, MainPageViewComponent, PageHeaderComponent],
})
export class UserDetailsComponent {}
