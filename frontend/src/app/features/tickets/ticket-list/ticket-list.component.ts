import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { TicketService } from '../ticket.service';
import { TicketListItem, TicketPriority, TicketStatus, TicketType } from '../types';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { CommonRouterService } from '../../../core/services/common-router.service';

@Component({
    selector: 'app-ticket-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatCheckboxModule,
        MatIconModule,
        MatChipsModule,
        MatButtonModule,
        MatTooltipModule,
        MatMenuModule,
        MatDividerModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        PageHeaderComponent,
        MainPageViewComponent,
    ],
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss'],
    providers: [CommonRouterService],
})
export class TicketListComponent {
    readonly ticketService = inject(TicketService);
    readonly commouRouter = inject(CommonRouterService);
    readonly ticketsResource = this.ticketService.ticketsResource;

    readonly tickets = this.ticketsResource.value;
    readonly isLoading = this.ticketsResource.isLoading;
    readonly error = this.ticketsResource.error;
    
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
            low: '#2e7d32',    // zielony
            medium: '#ed6c02', // pomarańczowy
            high: '#d32f2f',   // czerwony
            critical: '#b71c1c' // ciemnoczerwony
        };
        return colors[priority];
    }

    getStatusChipClass(status: TicketStatus): string {
        // Zwracamy nazwę klasy CSS dla danego statusu
        return `status-${status.replace(/_/g, '-')}`;
    }

    getTypeIcon(type: TicketType): string {
        return type === 'crm' ? 'support_agent' : 'bug_report';
    }

    // Rozwijanie/zwijanie ticketu
    toggleExpand(ticket: TicketListItem): void {
        ticket.isExpanded = !ticket.isExpanded;
    }

    // Zaznaczenie/odznaczenie pojedynczego
    toggleSelection(ticket: TicketListItem): void {
        ticket.selected = !ticket.selected;
    }

    // Symulacja akcji
    onAssign(ticket: TicketListItem): void {
        console.log('Przypisz ticket:', ticket.ticketNumber);
    }

    onChangeStatus(ticket: TicketListItem, newStatus: TicketStatus): void {
        console.log(`Zmiana statusu ${ticket.ticketNumber} na ${newStatus}`);
        // W realnej aplikacji: wywołanie API, a następnie aktualizacja listy
        ticket.status = newStatus;
        ticket.updatedAt = new Date();
    }

    onEdit(ticket: TicketListItem): void {
        console.log('Edytuj ticket:', ticket.ticketNumber);
    }
    getDescription(ticket: TicketListItem): string {
        // W rzeczywistości pobieramy pełny ticket z innego źródła
        // Tutaj tylko przykładowy tekst
        return `Szczegółowy opis ticketu ${ticket.ticketNumber}. Wersja demonstracyjna.`;
    }
    onDetails(tiket: TicketListItem): void {
        this.commouRouter.navitgateTo(['../details/test']);
    }
}