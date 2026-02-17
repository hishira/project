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
        MatProgressSpinnerModule
    ],
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent {
    ticketService = inject(TicketService);
    //tickets = this.ticketService.tickets;
    ticketsResource = this.ticketService.ticketsResource;

    // Dla wygody w szablonie – sygnały
    tickets = this.ticketsResource.value;
    isLoading = this.ticketsResource.isLoading;
    error = this.ticketsResource.error;
    // Pomocnicze metody do szablonu
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
}