import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { LoyaltyService } from '../loyalty.service';
import { CustomerLoyalty, PointsTransaction, Reward } from '../loyalty.model';

@Component({
  selector: 'app-loyalty-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule, MatChipsModule,
    MatDividerModule, MatTableModule, MatTabsModule
  ],
  templateUrl: './loyalty-detail.component.html',
  styleUrls: ['./loyalty-detail.component.scss']
})
export class LoyaltyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private loyaltyService = inject(LoyaltyService);

  customer = signal<CustomerLoyalty | undefined>(undefined);
  levels = this.loyaltyService.levels;

  transactionColumns: string[] = ['date', 'description', 'pointsChange', 'balanceAfter', 'source'];
  rewardColumns: string[] = ['name', 'pointsCost', 'discount', 'code', 'expiresAt', 'actions'];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.loyaltyService.getCustomerLoyalty(id);
      this.customer.set(found);
    }
  }

  getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700', platinum: '#e5e4e2'
    };
    return colors[level] || '#757575';
  }

  getLevelIcon(level: string): string {
    return level === 'platinum' ? 'workspace_premium' : 'emoji_events';
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