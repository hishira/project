import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Agreement } from '../../types';

@Component({
  selector: 'app-agreement-product-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule],
  template: `
    <mat-card class="mb-4">
      <mat-card-header>
        <mat-card-title>Informacje o produkcie</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p><strong>Nazwa:</strong> {{ agreement().product.name }}</p>
        <p><strong>Kategoria:</strong> {{ agreement().product.category }}</p>
        <p><strong>Cena:</strong> {{ agreement().product.price }} {{ agreement().currency }}</p>
        <mat-divider class="my-3" />
        <h5>Specyfikacje:</h5>
        <p>
          <strong>Aplikacje:</strong>
          @for (app of agreement().product.specifications.applications; track $index; let last = $last) {
            {{ app }}{{ last ? '' : ', ' }}
          }
        </p>
        <p><strong>Licencje użytkowników:</strong> {{ agreement().product.specifications.userLicenses }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AgreementProductInfoComponent {
  agreement = input.required<Agreement>();
}
