import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CalendarIntegration } from '../../integration.model';

@Component({
  selector: 'app-calendar-config',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <section class="section">
      <h3>Konfiguracja kalendarza ({{ calendar().provider }})</h3>
      <div class="config-grid">
        <div class="config-row">
          <span class="label">Client ID:</span>
          <span class="value">{{ calendar().config.clientId }}</span>
        </div>
        <div class="config-row">
          <span class="label">Redirect URI:</span>
          <span class="value">{{ calendar().config.redirectUri }}</span>
        </div>
        <div class="config-row">
          <span class="label">Kalendarz:</span>
          <span class="value">{{ calendar().config.calendarId || 'domyślny' }}</span>
        </div>
        <div class="config-row">
          <span class="label">Synchronizacja:</span>
          <span class="value">co {{ calendar().config.syncInterval }} minut</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .section { margin: 24px 0; }
    .section h3 {
      font-size: 1rem;
      font-weight: 500;
      color: #334155;
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .config-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }
    .config-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 0.9rem;
    }
    .config-row .label {
      color: #475569;
      min-width: 120px;
    }
    .config-row .value {
      color: #0f172a;
      font-weight: 500;
      word-break: break-word;
    }
  `]
})
export class CalendarConfigComponent {
  calendar = input.required<CalendarIntegration>();
}
