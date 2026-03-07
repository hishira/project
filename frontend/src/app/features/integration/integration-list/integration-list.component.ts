import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ApiIntegration, CalendarIntegration, EmailIntegration, Integration, MessengerIntegration } from '../integration.model';
import { IntegrationService } from '../integration.service';

@Component({
    selector: 'app-integration-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatTooltipModule,
        MatSlideToggleModule
    ],
    templateUrl: './integration-list.component.html',
    styleUrls: ['./integration-list.component.scss']
})
export class IntegrationListComponent {
    private integrationService = inject(IntegrationService);
    integrations = this.integrationService.integrations;

    // Grupowanie integracji według typu
    emailIntegrations = this.integrationService.getIntegrationsByType('email');
    calendarIntegrations = this.integrationService.getIntegrationsByType('calendar');
    messengerIntegrations = this.integrationService.getIntegrationsByType('messenger');
    apiIntegrations = this.integrationService.getIntegrationsByType('api');

    getStatusColor(status: string): string {
        const colors: Record<string, string> = {
            connected: '#2e7d32',
            disconnected: '#757575',
            error: '#d32f2f'
        };
        return colors[status] || '#757575';
    }

    getStatusIcon(status: string): string {
        const icons: Record<string, string> = {
            connected: 'check_circle',
            disconnected: 'pause_circle',
            error: 'error'
        };
        return icons[status] || 'help';
    }

    getTypeIcon(type: string): string {
        const icons: Record<string, string> = {
            email: 'email',
            calendar: 'calendar_month',
            messenger: 'chat',
            api: 'api'
        };
        return icons[type] || 'settings';
    }

    onToggleEnabled(integration: Integration, event: any) {
        event.stopPropagation();
        console.log('Zmiana stanu integracji:', integration.id, event.checked);
    }

    onTest(integration: Integration, event: MouseEvent) {
        event.stopPropagation();
        this.integrationService.testConnection(integration.id);
    }

    onEdit(integration: Integration, event: MouseEvent) {
        event.stopPropagation();
        console.log('Edytuj integrację:', integration.id);
    }

    onDelete(integration: Integration, event: MouseEvent) {
        event.stopPropagation();
        this.integrationService.deleteIntegration(integration.id);
    }

    isEmail(int: Integration): int is EmailIntegration {
        return int.type === 'email';
    }

    isCalendar(int: Integration): int is CalendarIntegration {
        return int.type === 'calendar';
    }

    isMessenger(int: Integration): int is MessengerIntegration {
        return int.type === 'messenger';
    }

    isApi(int: Integration): int is ApiIntegration {
        return int.type === 'api';
    }
}