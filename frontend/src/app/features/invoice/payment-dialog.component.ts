import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { Invoice, PaymentMethod } from './invoice.model';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Rejestracja wpłaty</h2>
    <mat-dialog-content>
      <div class="payment-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data wpłaty</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="payment.date" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Kwota</mat-label>
          <input matInput type="number" step="0.01" [(ngModel)]="payment.amount" required>
          <span matSuffix>{{ data.invoice.currency }}</span>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Metoda płatności</mat-label>
          <mat-select [(ngModel)]="payment.method" required>
            @for (m of methods; track m.value) {
              <mat-option [value]="m.value">{{ m.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Numer referencyjny</mat-label>
          <input matInput [(ngModel)]="payment.reference" placeholder="np. tytuł przelewu">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Uwagi</mat-label>
          <textarea matInput rows="3" [(ngModel)]="payment.notes"></textarea>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Anuluj</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!isValid()">Zapisz</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding: 8px 0;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class PaymentDialogComponent {
  payment = {
    date: new Date(),
    amount: 0,
    method: 'bank_transfer' as PaymentMethod,
    reference: '',
    notes: ''
  };

  methods: { value: PaymentMethod; label: string }[] = [
    { value: 'bank_transfer', label: 'Przelew bankowy' },
    { value: 'credit_card', label: 'Karta kredytowa' },
    { value: 'payu', label: 'PayU' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'cash', label: 'Gotówka' }
  ];

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoice: Invoice }
  ) { }

  isValid(): boolean {
    return this.payment.date != null && this.payment.amount > 0 && this.payment.method != null;
  }

  onSave() {
    if (this.isValid()) {
      this.dialogRef.close(this.payment);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}