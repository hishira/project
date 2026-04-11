import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Document } from '../../../documents/document.models';
import { getDocumentTypeIcon } from '../../client-status.utils';

@Component({
  selector: 'app-client-documents',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule, MatTableModule, RouterLink],
  template: `
    <mat-card class="documents-card">
      <mat-card-header>
        <mat-card-title>Dokumenty ({{ documents().length }})</mat-card-title>
        <button mat-button routerLink="/documents" [queryParams]="{ clientId: clientId() }">Zobacz wszystkie</button>
      </mat-card-header>
      <mat-card-content>
        @if (documents().length > 0) {
          <table mat-table [dataSource]="documents()" class="documents-table" aria-label="Dokumenty klienta">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef scope="col">Nazwa</th>
              <td mat-cell *matCellDef="let doc">
                <a [routerLink]="['/documents', doc.id]">{{ doc.name }}</a>
              </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef scope="col">Typ</th>
              <td mat-cell *matCellDef="let doc">
                <mat-icon [matTooltip]="doc.type">{{ getDocIcon(doc.type) }}</mat-icon>
              </td>
            </ng-container>

            <ng-container matColumnDef="uploaded">
              <th mat-header-cell *matHeaderCellDef scope="col">Data dodania</th>
              <td mat-cell *matCellDef="let doc">{{ doc.uploadedAt | date: 'dd MMM yyyy' }}</td>
            </ng-container>

            <ng-container matColumnDef="version">
              <th mat-header-cell *matHeaderCellDef scope="col">Wersja</th>
              <td mat-cell *matCellDef="let doc">{{ doc.version || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef scope="col"></th>
              <td mat-cell *matCellDef="let doc">
                <button mat-icon-button [routerLink]="['/documents', doc.id]" matTooltip="Szczegóły dokumentu"
                        aria-label="Zobacz szczegóły dokumentu {{ doc.name }}">
                  <mat-icon aria-hidden="true">visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        } @else {
          <p class="empty-state">Brak dokumentów</p>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .documents-card .empty-state {
      color: #94a3b8;
      text-align: center;
      padding: 24px;
      font-style: italic;
    }
    .documents-table { width: 100%; }
    .documents-table .mat-mdc-row:hover { background-color: #f8fafc; }
    .documents-table a {
      color: #0f172a;
      text-decoration: none;
      font-weight: 500;
    }
    .documents-table a:hover {
      text-decoration: underline;
      color: #1976d2;
    }
  `]
})
export class ClientDocumentsComponent {
  documents = input.required<Document[]>();
  clientId = input.required<string>();
  displayedColumns: string[] = ['name', 'type', 'uploaded', 'version', 'actions'];

  getDocIcon = getDocumentTypeIcon;
}
