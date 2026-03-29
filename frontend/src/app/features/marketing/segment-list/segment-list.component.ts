// segment-list.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarketingService } from '../marketing.service';
import { Segment } from '../marketing.models';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';

@Component({
  selector: 'app-segment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MainPageViewComponent,
    PageHeaderComponent,
  ],
  templateUrl: './segment-list.component.html',
  styleUrls: ['./segment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentListComponent {
  private readonly marketingService = inject(MarketingService);
  readonly segments = this.marketingService.segments;

  readonly displayedColumns: string[] = ['name', 'description', 'contactsCount', 'updatedAt', 'actions'];

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }
}