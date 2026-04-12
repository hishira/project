import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MessengerIntegration } from '../../integration.model';

@Component({
  selector: 'app-messenger-config',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <section class="section">
      <h3>Konfiguracja komunikatora ({{ messenger().provider }})</h3>
      <div class="config-grid">
        <div class="config-row">
          <span class="label">Webhook URL:</span>
          <span class="value">{{ messenger().config.webhookUrl || '(nie ustawiono)' }}</span>
        </div>
        <div class="config-row">
          <span class="label">Kanał:</span>
          <span class="value">{{ messenger().config.channel || 'domyślny' }}</span>
        </div>
        <div class="config-row">
          <span class="label">Powiadomienia o:</span>
          <span class="value">{{ messenger().config.notifyOn.join(', ') || 'brak' }}</span>
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
export class MessengerConfigComponent {
  messenger = input.required<MessengerIntegration>();
}
