import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MarketingService } from '../marketing.service';
import { Campaign } from '../marketing.models';
import {
  getCampaignStatusClass,
  getCampaignTypeIcon,
  formatDateTimePolish,
  calculateOpenRate,
  calculateClickRate,
  calculateBounceRate
} from '../marketing.constants';

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
export class CampaignDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly marketingService = inject(MarketingService);
  readonly campaign = signal<Campaign | undefined>(undefined);

  readonly getStatusClass = getCampaignStatusClass;
  readonly getTypeIcon = getCampaignTypeIcon;
  readonly formatDateTime = formatDateTimePolish;

  // Wrapper functions that accept Campaign object
  readonly calcOpenRate = computed(() => {
    const c = this.campaign();
    if (!c) return 0;
    return calculateOpenRate(c.stats.opened, c.stats.recipients);
  });

  readonly calcClickRate = computed(() => {
    const c = this.campaign();
    if (!c) return 0;
    return calculateClickRate(c.stats.clicked, c.stats.opened);
  });

  readonly calcBounceRate = computed(() => {
    const c = this.campaign();
    if (!c) return 0;
    return calculateBounceRate(c.stats.bounced, c.stats.recipients);
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = this.marketingService.campaigns().find(c => c.id === id);
        this.campaign.set(found);
      }
    });
  }
}
