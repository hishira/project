import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IntegrationService } from '../integration.service';
import { Integration, EmailIntegration, CalendarIntegration, MessengerIntegration, ApiIntegration } from '../integration.model';

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
    MatSlideToggleModule
  ],
  templateUrl: './integration-detail.component.html',
  styleUrls: ['./integration-detail.component.scss']
})
export class IntegrationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private integrationService = inject(IntegrationService);
  integration = signal<Integration | undefined>(undefined);
  showSecret = signal<Record<string, boolean>>({});

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.integrationService.getIntegrationById(id);
      this.integration.set(found);
    }
  }

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

  toggleSecret(keyId: string) {
    this.showSecret.update(map => ({ ...map, [keyId]: !map[keyId] }));
  }

  // Type guards
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

  onTest() {
    const int = this.integration();
    if (int) {
      this.integrationService.testConnection(int.id);
    }
  }

  onEdit() {
    const int = this.integration();
    if (int) {
      console.log('Edytuj integrację:', int.id);
    }
  }

  onToggleEnabled(event: any) {
    const int = this.integration();
    if (int) {
      console.log('Zmiana stanu integracji:', int.id, event.checked);
    }
  }

  onGenerateKey() {
    const int = this.integration();
    if (int && this.isApi(int)) {
      this.integrationService.generateApiKey(int.id, 'Nowy klucz');
    }
  }

  onRevokeKey(keyId: string) {
    const int = this.integration();
    if (int && this.isApi(int)) {
      this.integrationService.revokeApiKey(int.id, keyId);
    }
  }
}