// campaign-detail.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
  readonly calcOpenRate = calculateOpenRate;
  readonly calcClickRate = calculateClickRate;
  readonly calcBounceRate = calculateBounceRate;

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
