import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Integration } from '../integration.model';
import { IntegrationService } from '../integration.service';
import { getIntegrationStatusColor, getIntegrationStatusIcon, getIntegrationStatusLabel } from '../integration-status.utils';
import { EmailConfigComponent } from './email-config/email-config.component';
import { CalendarConfigComponent } from './calendar-config/calendar-config.component';
import { MessengerConfigComponent } from './messenger-config/messenger-config.component';
import { ApiConfigComponent } from './api-config/api-config.component';

@Component({
  selector: 'app-integration-detail',
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
    MatTooltipModule,
    MatSlideToggleModule,
    DatePipe,
    MainPageViewComponent,
    PageHeaderComponent,
    EmailConfigComponent,
    CalendarConfigComponent,
    MessengerConfigComponent,
    ApiConfigComponent,
  ],
  templateUrl: './integration-detail.component.html',
  styleUrls: ['./integration-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationDetailComponent {
  private route = inject(ActivatedRoute);
  private integrationService = inject(IntegrationService);
  readonly integration = signal<Integration | undefined>(undefined);

  readonly getStatusColor = getIntegrationStatusColor;
  readonly getStatusIcon = getIntegrationStatusIcon;
  readonly getStatusLabel = getIntegrationStatusLabel;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = this.integrationService.getIntegrationById(id);
        this.integration.set(found);
      }
    });
  }

  onTest(): void {
    const int = this.integration();
    if (int) {
      this.integrationService.testConnection(int.id);
    }
  }

  onToggleEnabled(enabled: boolean): void {
    const int = this.integration();
    if (int) {
      console.log('Zmiana stanu integracji:', int.id, enabled);
    }
  }

  onGenerateApiKey(): void {
    const int = this.integration();
    if (int) {
      this.integrationService.generateApiKey(int.id, 'Nowy klucz');
    }
  }

  onRevokeApiKey(keyId: string): void {
    const int = this.integration();
    if (int) {
      this.integrationService.revokeApiKey(int.id, keyId);
    }
  }
}
