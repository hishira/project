import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TicketService } from '../ticket.service';
import { TicketListItem, TicketStatus } from '../types';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { CommonRouterService } from '../../../core/services/common-router.service';
import { TicketItemComponent } from './ticket-item/ticket-item.component';

@Component({
    selector: 'app-ticket-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        PageHeaderComponent,
        MainPageViewComponent,
        TicketItemComponent,
    ],
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss'],
    providers: [CommonRouterService],
})
export class TicketListComponent {
    readonly ticketService = inject(TicketService);
    readonly commonRouter = inject(CommonRouterService);
    readonly ticketsResource = this.ticketService.ticketsResource;

    readonly tickets = this.ticketsResource.value;
    readonly isLoading = this.ticketsResource.isLoading;
    readonly error = this.ticketsResource.error;

    onExpandTicket(ticket: TicketListItem): void {
        ticket.isExpanded = true;
    }

    onCollapseTicket(ticket: TicketListItem): void {
        ticket.isExpanded = false;
    }

    onToggleSelection(ticket: TicketListItem): void {
        ticket.selected = !ticket.selected;
    }

    onAssignTicket(ticket: TicketListItem): void {
        console.log('Przypisz ticket:', ticket.ticketNumber);
    }

    onChangeStatus(ticket: TicketListItem, newStatus: TicketStatus): void {
        console.log(`Zmiana statusu ${ticket.ticketNumber} na ${newStatus}`);
        ticket.status = newStatus;
        ticket.updatedAt = new Date();
    }

    onEditTicket(ticket: TicketListItem): void {
        console.log('Edytuj ticket:', ticket.ticketNumber);
    }

    onDetailsTicket(ticket: TicketListItem): void {
        this.commonRouter.navitgateTo(['../details/test']);
    }
}