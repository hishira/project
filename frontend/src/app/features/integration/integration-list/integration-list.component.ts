import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Integration } from '../integration.model';
import { IntegrationService } from '../integration.service';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { INTEGRATION_TYPE_ICONS } from '../integration.constants';
import { INTEGRATION_STATUS_COLORS, INTEGRATION_STATUS_ICONS } from '../integration-status.utils';
import { isEmailIntegration, isCalendarIntegration, isMessengerIntegration, isApiIntegration } from '../integration-type.guards';

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
        MatSlideToggleModule,
        MainPageViewComponent,
        PageHeaderComponent,
    ],
    templateUrl: './integration-list.component.html',
    styleUrls: ['./integration-list.component.scss']
})
export class IntegrationListComponent {
    private integrationService = inject(IntegrationService);

    readonly integrations = this.integrationService.integrations;

    readonly emailIntegrations = computed(() =>
        this.integrationService.getIntegrationsByType('email')
    );

    readonly calendarIntegrations = computed(() =>
        this.integrationService.getIntegrationsByType('calendar')
    );

    readonly messengerIntegrations = computed(() =>
        this.integrationService.getIntegrationsByType('messenger')
    );

    readonly apiIntegrations = computed(() =>
        this.integrationService.getIntegrationsByType('api')
    );

    // Type guards
    readonly isEmailIntegration = isEmailIntegration;
    readonly isCalendarIntegration = isCalendarIntegration;
    readonly isMessengerIntegration = isMessengerIntegration;
    readonly isApiIntegration = isApiIntegration;

    // Utility functions
    readonly getStatusColor = (status: string): string => {
        const color = INTEGRATION_STATUS_COLORS[status as keyof typeof INTEGRATION_STATUS_COLORS];
        return color || '#757575';
    };

    readonly getStatusIcon = (status: string): string => {
        const icon = INTEGRATION_STATUS_ICONS[status as keyof typeof INTEGRATION_STATUS_ICONS];
        return icon || 'help';
    };

    readonly getTypeIcon = (type: Integration['type']): string => INTEGRATION_TYPE_ICONS[type];

    onToggleEnabled(integration: Integration, event: any): void {
        event.stopPropagation();
        console.log('Zmiana stanu integracji:', integration.id, event.checked);
    }

    onTest(integration: Integration, event: MouseEvent): void {
        event.stopPropagation();
        this.integrationService.testConnection(integration.id);
    }

    onEdit(integration: Integration, event: MouseEvent): void {
        event.stopPropagation();
        console.log('Edytuj integrację:', integration.id);
    }

    onDelete(integration: Integration, event: MouseEvent): void {
        event.stopPropagation();
        this.integrationService.deleteIntegration(integration.id);
    }
}