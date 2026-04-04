import { ChangeDetectionStrategy, Component, Signal, computed, inject } from '@angular/core';
import { TicketDetails } from '../types';
import { imports } from './ticket-details.dependency';
import { TicketDetailService } from './ticket-details.service';
import { getPriorityIcon, getPriorityColor, getStatusLabel, getStatusClass } from '../ticket-status.utils';

@Component({
  selector: 'app-ticket-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...imports
  ],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailComponent {
  private ticketService = inject(TicketDetailService);
  private resourceRef = this.ticketService.getResource();

  readonly ticketDetails: Signal<TicketDetails | undefined> = this.resourceRef.value;
  readonly isLoading: Signal<boolean> = this.resourceRef.isLoading;
  readonly error: Signal<boolean> = computed(() => this.resourceRef.status() === 'error');
  readonly reload = (): void => {
    this.resourceRef.reload();
  };

  // Utility functions exposed for template
  readonly getPriorityIcon = getPriorityIcon;
  readonly getPriorityColor = getPriorityColor;
  readonly getStatusLabel = getStatusLabel;
  readonly getStatusClass = getStatusClass;

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
}