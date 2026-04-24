import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ClientStatus } from '../client.model';

@Component({
  selector: 'app-client-list-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
  ],
  template: `
    <mat-card class="filters-card">
      <mat-card-content>
        <div class="filters-grid">
          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label>Nazwa firmy</mat-label>
            <input
              matInput
              [(ngModel)]="filterName"
              (input)="onFilterChange()"
              placeholder="Wpisz nazwę"
              aria-label="Filtruj po nazwie firmy" />
          </mat-form-field>
          <mat-form-field appearance="outline" subscriptSizing="dynamic">
            <mat-label>Status</mat-label>
            <mat-select [(ngModel)]="filterStatus" (selectionChange)="onFilterChange()" aria-label="Filtruj po statusie">
              <mat-option value="">Wszystkie</mat-option>
              @for (s of statuses(); track s.value) {
                <mat-option [value]="s.value">{{ s.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
        <div class="filter-actions">
          <button mat-button (click)="onClearFilters()" aria-label="Wyczyść wszystkie filtry">Wyczyść filtry</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .filters-card {
      margin-bottom: 2rem;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .filter-actions {
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class ClientListFiltersComponent {
  filterName = signal<string>('');
  filterStatus = signal<ClientStatus | ''>('');

  statuses = input.required<{ value: ClientStatus; label: string }[]>();

  filtersChange = output<{ name: string; status: ClientStatus | '' }>();

  onFilterChange(): void {
    this.filtersChange.emit({
      name: this.filterName(),
      status: this.filterStatus()
    });
  }

  onClearFilters(): void {
    this.filterName.set('');
    this.filterStatus.set('');
    this.onFilterChange();
  }
}