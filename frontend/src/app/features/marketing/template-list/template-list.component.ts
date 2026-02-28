// template-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarketingService } from '../marketing.service';
import { MessageTemplate } from '../marketing.models';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent {
  private marketingService = inject(MarketingService);
  templates = this.marketingService.templates;

  displayedColumns: string[] = ['name', 'type', 'subject', 'updatedAt', 'actions'];

  getTypeIcon(type: string): string {
    const map: Record<string, string> = {
      email: 'email',
      sms: 'sms',
      social: 'share',
      push: 'notifications'
    };
    return map[type] || 'description';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pl-PL', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  }

  getTypeClass(type: string): string {
    return `type-${type}`;
  }
}