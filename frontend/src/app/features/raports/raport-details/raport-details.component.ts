import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Report } from '../types';
import { RaportTypesComponent } from './raport-types/raport-types.component';
import { SAMPLE_REPORT_DETAILS } from './samples';

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
export class ReportDetailComponent implements OnInit {
  report?: Report = SAMPLE_REPORT_DETAILS[0];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.report = SAMPLE_REPORT_DETAILS.find(r => r.id === id);
    } else {
      // Domyślnie pierwszy
      this.report = SAMPLE_REPORT_DETAILS[0];
    }


  }
}