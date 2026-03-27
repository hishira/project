import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { CustomerLoyalty, Reward } from '../loyalty.model';
import { LoyaltyService } from '../loyalty.service';
import { LevelSummaryBadgeComponent } from './level-summary-badge/level-summary-badge.component';
import { PointsSummaryComponent } from './points-summary/points-summary.component';
import { DetailProgressComponent } from './detail-progress/detail-progress.component';
import { RewardsTableComponent } from './rewards-table/rewards-table.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';

@Component({
  selector: 'app-loyalty-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    MainPageViewComponent,
    PageHeaderComponent,
    LevelSummaryBadgeComponent,
    PointsSummaryComponent,
    DetailProgressComponent,
    RewardsTableComponent,
    TransactionsTableComponent,
  ],
  templateUrl: './loyalty-detail.component.html',
  styleUrls: ['./loyalty-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly loyaltyService = inject(LoyaltyService);

  readonly customer = signal<CustomerLoyalty | undefined>(undefined);
  readonly levels = this.loyaltyService.levels;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.loyaltyService.getCustomerLoyalty(id);
      this.customer.set(found);
    }
  }

  onRedeem(reward: Reward) {
    console.log('Wykorzystanie nagrody', reward);
  }

  onGenerateReward() {
    console.log('Generuj nową nagrodę dla', this.customer()?.customerName);
  }

  onAddPoints() {
    console.log('Dodaj punkty ręcznie');
  }
}