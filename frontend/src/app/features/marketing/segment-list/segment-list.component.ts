// segment-list.component.ts
import { Component, inject } from '@angular/core';
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
    MatTooltipModule
  ],
  templateUrl: './segment-list.component.html',
  styleUrls: ['./segment-list.component.scss']
})
export class SegmentListComponent {
  private marketingService = inject(MarketingService);
  segments = this.marketingService.segments;

  displayedColumns: string[] = ['name', 'description', 'contactsCount', 'updatedAt', 'actions'];

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pl-PL', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  }
}