import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Report } from '../types';
import { RaportTypesComponent } from './raport-types/raport-types.component';
import { SAMPLE_REPORT_DETAILS } from '../raports-mock-data';

@Component({
  selector: 'app-report-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    PageHeaderComponent,
    MainPageViewComponent,
    RaportTypesComponent,
  ],
  templateUrl: './raport-details.component.html',
  styleUrls: ['./report-details.components.scss']
})
export class ReportDetailComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly routeParams = toSignal(this.route.paramMap);

  readonly report = computed(() => {
    const id = this.routeParams()?.get('id');
    if (id) {
      return SAMPLE_REPORT_DETAILS.find(r => r.id === id);
    }
    return SAMPLE_REPORT_DETAILS[0];
  });
}