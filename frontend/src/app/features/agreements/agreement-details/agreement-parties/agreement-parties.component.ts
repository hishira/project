import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Agreement } from '../../types';

@Component({
  selector: 'app-agreement-parties',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="mb-4">
      <mat-card-header>
        <mat-card-title>Strony umowy</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="row">
          <div class="col-6">
            <h6>Strona A:</h6>
            <p><strong>{{ agreement().primaryParties.partyA.name }}</strong></p>
            <p>{{ agreement().primaryParties.partyA.email }}</p>
          </div>
          <div class="col-6">
            <h6>Strona B:</h6>
            <p><strong>{{ agreement().primaryParties.partyB.name }}</strong></p>
            <p>{{ agreement().primaryParties.partyB.email }}</p>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AgreementPartiesComponent {
  agreement = input.required<Agreement>();
}
