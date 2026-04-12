import { Component, input, output, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiIntegration, ApiKey } from '../../integration.model';

@Component({
  selector: 'app-api-config',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatButtonModule, MatIconModule, MatListModule, MatTooltipModule],
  template: `
    <section class="section">
      <h3>Klucze API</h3>
      <div class="api-keys-header">
        <span>Limit zapytań: {{ api().config.rateLimit || 'brak' }} na godzinę</span>
        <button mat-stroked-button (click)="onGenerateKey()" aria-label="Generuj nowy klucz API">
          <mat-icon aria-hidden="true">add</mat-icon> Generuj nowy klucz
        </button>
      </div>

      <mat-list class="api-keys-list">
        @for (key of api().config.apiKeys; track key.id) {
          <mat-list-item class="api-key-item">
            <div class="key-row">
              <div class="key-info">
                <span class="key-name">{{ key.name }}</span>
                <span class="key-value">
                  @if (showSecret()[key.id]) {
                    {{ key.key }}
                  } @else {
                    ••••••••••••••••••••••••
                  }
                </span>
              </div>
              <div class="key-meta">
                <span class="key-date">Utworzono: {{ key.createdAt | date: 'dd MMM yyyy' }}</span>
                @if (key.lastUsed) {
                  <span class="key-date">Ostatnio użyty: {{ key.lastUsed | date: 'dd MMM yyyy' }}</span>
                }
                @if (key.expiresAt) {
                  <span class="key-expiry">Wygasa: {{ key.expiresAt | date: 'dd MMM yyyy' }}</span>
                }
              </div>
              <div class="key-actions">
                <button mat-icon-button (click)="toggleSecret(key.id)" matTooltip="Pokaż lub ukryj klucz"
                        [attr.aria-label]="showSecret()[key.id] ? 'Ukryj klucz' : 'Pokaż klucz'">
                  <mat-icon aria-hidden="true">{{ showSecret()[key.id] ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="onRevokeKey(key.id)" matTooltip="Unieważnij klucz"
                        [attr.aria-label]="'Unieważnij klucz ' + key.name">
                  <mat-icon aria-hidden="true">delete</mat-icon>
                </button>
              </div>
            </div>
          </mat-list-item>
        }
      </mat-list>
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
    .api-keys-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .api-keys-list {
      .api-key-item {
        height: auto !important;
        padding: 12px 0;
        border-bottom: 1px solid #e2e8f0;
        &:last-child { border-bottom: none; }
      }
    }
    .key-row {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      width: 100%;
      flex-wrap: wrap;
    }
    .key-info {
      flex: 2;
      min-width: 200px;
      .key-name {
        display: block;
        font-weight: 500;
        color: #0f172a;
      }
      .key-value {
        font-family: 'Roboto Mono', monospace;
        font-size: 0.85rem;
        color: #475569;
      }
    }
    .key-meta {
      flex: 1;
      min-width: 150px;
      display: flex;
      flex-direction: column;
      font-size: 0.75rem;
      color: #475569;
      .key-expiry { color: #b45309; }
    }
    .key-actions {
      display: flex;
      gap: 4px;
    }
  `]
})
export class ApiConfigComponent {
  api = input.required<ApiIntegration>();
  generateKey = output<void>();
  revokeKey = output<string>();

  readonly showSecret = signal<Record<string, boolean>>({});

  onGenerateKey() {
    this.generateKey.emit();
  }

  onRevokeKey(keyId: string) {
    this.revokeKey.emit(keyId);
  }

  toggleSecret(keyId: string): void {
    this.showSecret.update(map => ({ ...map, [keyId]: !map[keyId] }));
  }
}
