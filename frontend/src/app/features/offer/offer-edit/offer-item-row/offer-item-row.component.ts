import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-offer-item-row',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatTooltipModule
  ],
  template: `
    <div [formGroup]="itemGroup" class="item-row">
      <div class="item-header">
        <span class="item-index">Pozycja {{ itemIndex + 1 }}</span>
        <button mat-icon-button type="button" color="warn" (click)="onRemove()" matTooltip="Usuń">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
      <div class="item-fields">
        <mat-form-field appearance="outline" class="item-name">
          <mat-label>Nazwa</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>
        <mat-form-field appearance="outline" class="item-desc">
          <mat-label>Opis</mat-label>
          <input matInput formControlName="description">
        </mat-form-field>
        <mat-form-field appearance="outline" class="item-qty">
          <mat-label>Ilość</mat-label>
          <input matInput type="number" formControlName="quantity" (input)="onRecalc()">
        </mat-form-field>
        <mat-form-field appearance="outline" class="item-unit">
          <mat-label>J.m.</mat-label>
          <input matInput formControlName="unit">
        </mat-form-field>
        <mat-form-field appearance="outline" class="item-price">
          <mat-label>Cena netto</mat-label>
          <input matInput type="number" formControlName="netPrice" (input)="onRecalc()">
        </mat-form-field>
        <mat-form-field appearance="outline" class="item-discount">
          <mat-label>Rabat %</mat-label>
          <input matInput type="number" formControlName="discountPercent" (input)="onRecalc()">
        </mat-form-field>
        <mat-form-field appearance="outline" class="item-vat">
          <mat-label>VAT %</mat-label>
          <input matInput type="number" formControlName="vatRate" (input)="onRecalc()">
        </mat-form-field>
        <div class="item-readonly">
          <span class="readonly-label">Netto:</span>
          <span class="readonly-value">{{ itemGroup.get('netAmount')?.value | number:'1.2-2' }}</span>
        </div>
        <div class="item-readonly">
          <span class="readonly-label">VAT:</span>
          <span class="readonly-value">{{ itemGroup.get('vatAmount')?.value | number:'1.2-2' }}</span>
        </div>
        <div class="item-readonly">
          <span class="readonly-label">Brutto:</span>
          <span class="readonly-value">{{ itemGroup.get('grossAmount')?.value | number:'1.2-2' }}</span>
        </div>
      </div>
      <mat-divider></mat-divider>
    </div>
  `,
  styles: [`
    .item-row {
      margin: 24px 0;

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .item-index {
          font-weight: 500;
          color: #334155;
        }
      }

      .item-fields {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
        align-items: center;
      }

      .item-name {
        grid-column: span 2;
      }
      .item-desc {
        grid-column: span 2;
      }
      .item-readonly {
        display: flex;
        flex-direction: column;
        font-size: 0.85rem;
        background: #f8fafc;
        padding: 8px;
        border-radius: 4px;

        .readonly-label {
          color: #64748b;
        }
        .readonly-value {
          font-weight: 600;
          color: #0f172a;
        }
      }
    }
  `]
})
export class OfferItemRowComponent {
  @Input({ required: true }) itemGroup!: FormGroup;
  @Input({ required: true }) itemIndex!: number;

  @Output() remove = new EventEmitter<number>();
  @Output() recalc = new EventEmitter<number>();

  onRemove() {
    this.remove.emit(this.itemIndex);
  }

  onRecalc() {
    this.recalc.emit(this.itemIndex);
  }
}
