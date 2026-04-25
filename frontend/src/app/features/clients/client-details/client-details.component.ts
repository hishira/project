import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
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

    private routeParams = toSignal(this.route.paramMap);

    readonly clientId = computed(() => this.routeParams()?.get('id') || '');

    readonly client = computed(() => {
        const id = this.clientId();
        return id ? this.clientService.getClientById(id) : undefined;
    });

    readonly clientDocuments = computed(() => {
        const client = this.client();
        return client ? this.documentService.documents().filter(d => d.clientId === client.id) : [];
    });
}
