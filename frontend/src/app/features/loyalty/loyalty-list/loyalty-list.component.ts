import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LoyaltyService } from '../loyalty.service';

@Component({
  selector: 'app-loyalty-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatTooltipModule,
    MatTableModule, MatPaginatorModule, MatSortModule
  ],
  templateUrl: './loyalty-list.component.html',
  styleUrls: ['./loyalty-list.component.scss']
})
export class LoyaltyListComponent {
  private loyaltyService = inject(LoyaltyService);
  customers = this.loyaltyService.customers;
  levels = this.loyaltyService.levels;

  displayedColumns: string[] = ['customer', 'level', 'points', 'nextLevel', 'rewards', 'actions'];

  getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#e5e4e2'
    };
    return colors[level] || '#757575';
  }

  getLevelIcon(level: string): string {
    const icons: Record<string, string> = {
      bronze: 'emoji_events',
      silver: 'emoji_events',
      gold: 'emoji_events',
      platinum: 'workspace_premium'
    };
    return icons[level] || 'stars';
  }

  getProgressWidth(points: number, nextThreshold: number | undefined): number {
    if (!nextThreshold) return 100;
    return Math.min(100, (points / nextThreshold) * 100);
  }
  onAdd(): void {
    
  }
}