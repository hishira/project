// campaign-detail.component.ts
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarketingService } from '../marketing.service';
import { Campaign } from '../marketing.models';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    MatSpinner,
    MatProgressBarModule,
    MainPageViewComponent,
    PageHeaderComponent,
  ],
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly marketingService = inject(MarketingService);
  readonly campaign = signal<Campaign | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const found = this.marketingService.campaigns().find(c => c.id === id);
    this.campaign.set(found);
  }

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

  formatDate(date?: Date): string {
    return date ? new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date) : '—';
  }

  calculateOpenRate(campaign: Campaign): number {
    if (!campaign.stats.recipients) return 0;
    return Math.round((campaign.stats.opened / campaign.stats.recipients) * 100 * 10) / 10;
  }

  calculateClickRate(campaign: Campaign): number {
    if (!campaign.stats.opened) return 0;
    return Math.round((campaign.stats.clicked / campaign.stats.opened) * 100 * 10) / 10;
  }

  calculateBounceRate(campaign: Campaign): number {
    if (!campaign.stats.recipients) return 0;
    return Math.round((campaign.stats.bounced / campaign.stats.recipients) * 100 * 10) / 10;
  }
}