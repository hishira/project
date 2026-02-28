import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MarketingService } from '../marketing.service';
import { MatList } from '@angular/material/list';

@Component({
  selector: 'app-marketing-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatList,
  ],
  templateUrl: './marketing-dashboard.component.html',
  styleUrls: ['./marketing-dashboard.component.scss']
})
export class MarketingDashboardComponent {
  private marketingService = inject(MarketingService);
  summary = this.marketingService.getMarketingSummary();
  campaigns = this.marketingService.campaigns;

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      draft: 'status-draft',
      scheduled: 'status-scheduled',
      active: 'status-active',
      paused: 'status-paused',
      completed: 'status-completed',
      archived: 'status-archived'
    };
    return map[status] || '';
  }

  getTypeIcon(type: string): string {
    const map: Record<string, string> = {
      email: 'email',
      sms: 'sms',
      social: 'share',
      push: 'notifications'
    };
    return map[type] || 'campaign';
  }
}