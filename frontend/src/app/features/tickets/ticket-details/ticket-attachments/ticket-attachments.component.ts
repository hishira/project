import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: 'app-ticket-attachments',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './ticket-attachments.component.html',
    styleUrl: './ticket-attachments.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MatIconModule,
        MatTooltipModule,
        MatChipsModule,
    ],
})
export class TicketAttachmentsComponent {
    readonly ticketDetails = input.required<any>()
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