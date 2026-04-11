import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Client } from '../../client.model';
import { getClientStatusLabel, getClientStatusClass } from '../../client-status.utils';

@Component({
  selector: 'app-client-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  template: `
    <mat-card class="main-card">
      <mat-card-header>
        <div class="header-row">
          <div class="title-section">
            <mat-card-title>{{ client().name }}</mat-card-title>
            <mat-card-subtitle>
              @if (client().shortName) {
                <span class="short-name">{{ client().shortName }}</span>
              }
              <mat-chip [class]="getStatusClass(client().status)" class="status-chip" role="status"
                        [attr.aria-label]="'Status klienta: ' + getStatusLabel(client().status)">
                {{ getStatusLabel(client().status) }}
              </mat-chip>
            </mat-card-subtitle>
          </div>
        </div>
      </mat-card-header>

      <mat-card-content>
        <!-- Dane podstawowe -->
        <section class="section" aria-labelledby="basic-info-heading">
          <h3 id="basic-info-heading">Dane podstawowe</h3>
          <div class="metadata-grid">
            @if (client().taxId) {
              <div class="metadata-item">
                <mat-icon aria-hidden="true">badge</mat-icon>
                <span class="label">NIP:</span>
                <span class="value">{{ client().taxId }}</span>
              </div>
            }
            @if (client().regon) {
              <div class="metadata-item">
                <mat-icon aria-hidden="true">numbers</mat-icon>
                <span class="label">REGON:</span>
                <span class="value">{{ client().regon }}</span>
              </div>
            }
            @if (client().industry) {
              <div class="metadata-item">
                <mat-icon aria-hidden="true">business_center</mat-icon>
                <span class="label">Branża:</span>
                <span class="value">{{ client().industry }}</span>
              </div>
            }
            @if (client().website) {
              <div class="metadata-item">
                <mat-icon aria-hidden="true">language</mat-icon>
                <span class="label">WWW:</span>
                <a [href]="client().website" target="_blank" rel="noopener noreferrer" class="value">{{ client().website }}</a>
              </div>
            }
            @if (client().phone) {
              <div class="metadata-item">
                <mat-icon aria-hidden="true">phone</mat-icon>
                <span class="label">Telefon:</span>
                <span class="value">{{ client().phone }}</span>
              </div>
            }
            @if (client().email) {
              <div class="metadata-item">
                <mat-icon aria-hidden="true">email</mat-icon>
                <span class="label">E-mail:</span>
                <a [href]="'mailto:' + client().email" class="value">{{ client().email }}</a>
              </div>
            }
          </div>
        </section>

        <!-- Adres -->
        @if (client().address; as addr) {
          <section class="section" aria-labelledby="address-heading">
            <h3 id="address-heading">Adres</h3>
            <div class="address">
              {{ addr.street }}<br />
              {{ addr.postalCode }} {{ addr.city }}<br />
              {{ addr.country }}
            </div>
          </section>
        }

        <!-- Tagi -->
        @if (client().tags?.length) {
          <section class="section" aria-labelledby="tags-heading">
            <h3 id="tags-heading">Tagi</h3>
            <mat-chip-set>
              @for (tag of client().tags; track tag) {
                <mat-chip>{{ tag }}</mat-chip>
              }
            </mat-chip-set>
          </section>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .main-card .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      flex-wrap: wrap;
      gap: 16px;
    }
    .title-section { flex: 1; }
    .title-section .short-name {
      font-size: 0.9rem;
      color: #475569;
      margin-right: 12px;
    }
    .section { margin: 24px 0; }
    .section h3 {
      font-size: 1rem;
      font-weight: 500;
      color: #334155;
      margin: 0 0 16px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .metadata-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }
    .metadata-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
    }
    .metadata-item mat-icon {
      color: #475569;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .metadata-item .label {
      color: #475569;
      min-width: 70px;
    }
    .metadata-item .value {
      color: #0f172a;
      font-weight: 500;
      text-decoration: none;
    }
    .metadata-item a.value:hover {
      text-decoration: underline;
      color: #1976d2;
    }
    .address {
      background: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      line-height: 1.6;
      color: #1e293b;
    }
    .status-chip { font-size: 0.75rem; min-height: 24px; padding: 0 8px; }
    .status-active { background-color: #d1fae5 !important; color: #065f46 !important; }
    .status-inactive { background-color: #e2e8f0 !important; color: #334155 !important; }
    .status-lead { background-color: #fef3c7 !important; color: #92400e !important; }
    .status-former { background-color: #fee2e2 !important; color: #b91c1c !important; }
  `]
})
export class ClientInfoComponent {
  client = input.required<Client>();

  getStatusLabel = getClientStatusLabel;
  getStatusClass = getClientStatusClass;
}
