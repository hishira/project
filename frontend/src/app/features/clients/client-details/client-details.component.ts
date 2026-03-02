import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Document } from '../../documents/document.models';
import { DocumentService } from '../../documents/document.service';
import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
    selector: 'app-client-detail',
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
        MatTabsModule,
        MatTableModule,
        MatTooltipModule,
    ],
    templateUrl: './client-details.component.html',
    styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private clientService = inject(ClientService);
    private documentService = inject(DocumentService);

    client = signal<Client | undefined>(undefined);
    clientDocuments = signal<Document[]>([]);

    displayedColumns: string[] = ['name', 'type', 'uploaded', 'version', 'actions'];

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const found = this.clientService.getClientById(id);
            this.client.set(found);
            if (found) {
                const docs = this.documentService.documents().filter(d => d.clientId === id);
                this.clientDocuments.set(docs);
            }
        }
    }

    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            active: 'status-active',
            inactive: 'status-inactive',
            lead: 'status-lead',
            former: 'status-former'
        };
        return map[status] || '';
    }

    getTypeIcon(type: string): string {
        const icons: Record<string, string> = {
            contract: 'description',
            annex: 'note_add',
            specification: 'science',
            protocol: 'assignment',
            other: 'insert_drive_file'
        };
        return icons[type] || 'description';
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = {
            active: 'Aktywny',
            inactive: 'Nieaktywny',
            lead: 'Potencjalny',
            former: 'Były'
        };
        return map[status] || status;
    }
}