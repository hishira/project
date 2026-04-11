import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../client.service';
import { Client } from '../client.model';
import { Document } from '../../documents/document.models';
import { DocumentService } from '../../documents/document.service';
import { ClientInfoComponent } from './client-info/client-info.component';
import { ClientContactsComponent } from './client-contacts/client-contacts.component';
import { ClientDocumentsComponent } from './client-documents/client-documents.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';

@Component({
    selector: 'app-client-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        ClientInfoComponent,
        ClientContactsComponent,
        ClientDocumentsComponent,
        PageHeaderComponent,
        MainPageViewComponent,
    ],
    templateUrl: './client-details.component.html',
    styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent {
    private route = inject(ActivatedRoute);
    private clientService = inject(ClientService);
    private documentService = inject(DocumentService);

    readonly client = signal<Client | undefined>(undefined);
    readonly clientDocuments = signal<Document[]>([]);

    constructor() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                const found = this.clientService.getClientById(id);
                this.client.set(found);
                if (found) {
                    const docs = this.documentService.documents().filter(d => d.clientId === id);
                    this.clientDocuments.set(docs);
                }
            }
        });
    }
}
