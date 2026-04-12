import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { EmailIntegration } from '../../integration.model';

@Component({
  selector: 'app-email-config',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <section class="section">
      <h3>Konfiguracja poczty</h3>
      <div class="config-grid">
        <div class="config-row">
          <span class="label">Serwer IMAP:</span>
          <span class="value">{{ email().config.imapHost }}:{{ email().config.imapPort }}</span>
        </div>
        <div class="config-row">
          <span class="label">Serwer SMTP:</span>
          <span class="value">{{ email().config.smtpHost }}:{{ email().config.smtpPort }}</span>
        </div>
        <div class="config-row">
          <span class="label">Użytkownik:</span>
          <span class="value">{{ email().config.username }}</span>
        </div>
        <div class="config-row">
          <span class="label">SSL:</span>
          <span class="value">{{ email().config.useSSL ? 'Tak' : 'Nie' }}</span>
        </div>
        <div class="config-row">
          <span class="label">Folder:</span>
          <span class="value">{{ email().config.folder }}</span>
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
export class EmailConfigComponent {
  email = input.required<EmailIntegration>();
}
