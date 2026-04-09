import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Agreement } from '../../types';

@Component({
  selector: 'app-agreement-tags',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Tagi</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (agreement().tags && agreement().tags.length > 0) {
          <mat-chip-listbox>
            @for (tag of agreement().tags; track $index) {
              <mat-chip>{{ tag }}</mat-chip>
            }
          </mat-chip-listbox>
        } @else {
          <p class="text-muted">Brak tagów</p>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AgreementTagsComponent {
  agreement = input.required<Agreement>();
}
