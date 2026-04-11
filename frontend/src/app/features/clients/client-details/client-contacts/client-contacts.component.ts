import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ContactPerson } from '../../client.model';

@Component({
  selector: 'app-client-contacts',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatListModule],
  template: `
    <mat-card class="contacts-card">
      <mat-card-header>
        <mat-card-title>Osoby kontaktowe</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (contacts()?.length) {
          <mat-list role="list">
            @for (contact of contacts(); track contact.id) {
              <mat-list-item class="contact-item" role="listitem">
                <div class="contact-row">
                  <div class="contact-avatar" aria-hidden="true">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div class="contact-info">
                    <span class="contact-name">{{ contact.fullName }}</span>
                    @if (contact.position) {
                      <span class="contact-position">{{ contact.position }}</span>
                    }
                    @if (contact.isPrimary) {
                      <mat-chip class="primary-chip" role="status" aria-label="Główna osoba kontaktowa">główny</mat-chip>
                    }
                  </div>
                  <div class="contact-details">
                    @if (contact.phone) {
                      <div class="contact-detail">
                        <mat-icon aria-hidden="true">phone</mat-icon> {{ contact.phone }}
                      </div>
                    }
                    @if (contact.email) {
                      <div class="contact-detail">
                        <mat-icon aria-hidden="true">email</mat-icon> {{ contact.email }}
                      </div>
                    }
                  </div>
                </div>
              </mat-list-item>
            }
          </mat-list>
        } @else {
          <p class="empty-state">Brak osób kontaktowych</p>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .contacts-card .empty-state {
      color: #94a3b8;
      text-align: center;
      padding: 24px;
      font-style: italic;
    }
    .contact-item { height: auto !important; padding: 12px 0; }
    .contact-row {
      display: flex;
      align-items: flex-start;
      width: 100%;
      gap: 16px;
      flex-wrap: wrap;
    }
    .contact-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .contact-avatar mat-icon { color: #475569; }
    .contact-info { flex: 1; min-width: 150px; }
    .contact-name { display: block; font-weight: 500; color: #0f172a; }
    .contact-position { font-size: 0.8rem; color: #475569; }
    .contact-details { display: flex; flex-direction: column; gap: 4px; }
    .contact-detail {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      color: #334155;
    }
    .contact-detail mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #475569;
    }
    .primary-chip {
      background-color: #dbeafe !important;
      color: #1e3a8a !important;
      font-size: 0.7rem;
      min-height: 24px;
      margin-left: 8px;
    }
  `]
})
export class ClientContactsComponent {
  contacts = input.required<ContactPerson[] | undefined>();
}
