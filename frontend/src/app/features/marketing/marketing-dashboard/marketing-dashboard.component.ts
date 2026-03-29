import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MarketingService } from '../marketing.service';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { StatCardComponent } from './stat-card/stat-card.component';
import { RecentCampaignsListComponent } from './recent-campaigns-list/recent-campaigns-list.component';
import { TopPerformingListComponent } from './top-performing-list/top-performing-list.component';

@Component({
  selector: 'app-marketing-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MainPageViewComponent,
    PageHeaderComponent,
    StatCardComponent,
    RecentCampaignsListComponent,
    TopPerformingListComponent,
  ],
  templateUrl: './marketing-dashboard.component.html',
  styleUrls: ['./marketing-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingDashboardComponent {
  private readonly marketingService = inject(MarketingService);
  readonly summary = this.marketingService.getMarketingSummary();
}
