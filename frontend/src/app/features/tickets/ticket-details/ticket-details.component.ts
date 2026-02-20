import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { CrmTicket, PmIssue, TicketDetails, TicketListItem, TicketPriority, TicketStatus } from '../types';
import { TicketAttachmentsComponent } from './ticket-attachments/ticket-attachments.component';
import { TicketDetailService } from './ticket-details.service';
import { TicketMetadataComponent } from './ticket-metadata/ticket-metadata.component';

@Component({
  selector: 'app-ticket-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PageHeaderComponent,
    MainPageViewComponent,
    TicketMetadataComponent,
    TicketAttachmentsComponent
  ],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailComponent {
  private ticketService = inject(TicketDetailService);
  private reouserceRes = this.ticketService.getResource();

  readonly ticketDetails: WritableSignal<any> = this.reouserceRes.value;
  readonly isLoading: Signal<boolean> = this.reouserceRes.isLoading;
  readonly error: Signal<boolean> = computed(() => this.reouserceRes.status() === 'error');
  readonly reaload = ()=>this.reouserceRes.reload();


  // Metody pomocnicze dla szablonu
  getPriorityIcon(priority: TicketPriority): string {
    const icons: Record<TicketPriority, string> = {
      low: 'arrow_downward',
      medium: 'remove',
      high: 'arrow_upward',
      critical: 'priority_high'
    };
    return icons[priority] || 'help';
  }

  getPriorityColor(priority: TicketPriority): string {
    const colors: Record<TicketPriority, string> = {
      low: '#2e7d32',
      medium: '#ed6c02',
      high: '#d32f2f',
      critical: '#b71c1c'
    };
    return colors[priority];
  }

  getStatusChipClass(status: TicketStatus): string {
    return `status-${status?.replace?.(/_/g, '-')}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('text/')) return 'description';
    if (mimeType.includes('pdf')) return 'picture_as_pdf';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'table_chart';
    return 'attach_file';
  }

  isCrmTicket(details: TicketDetails): details is CrmTicket & { relatedTickets?: TicketListItem[]; timeTracking?: any; isLoading: boolean; error?: string } {
    return details.type === 'crm';
  }

  isPmIssue(details: TicketDetails): details is PmIssue & { relatedTickets?: TicketListItem[]; timeTracking?: any; isLoading: boolean; error?: string } {
    return details.type === 'pm';
  }
}