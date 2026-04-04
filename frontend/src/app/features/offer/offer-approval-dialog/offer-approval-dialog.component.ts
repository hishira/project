import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Offer } from '../offer.model';

export interface OfferApprovalDialogData {
  offer: Offer;
}

export const OFFER_APPROVAL_DIALOG_CONFIG = {
  width: '500px'
};

@Component({
  selector: 'app-offer-approval-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Żądanie akceptacji</h2>
    <mat-dialog-content>
      <p class="offer-info">
        Oferta: <strong>{{ data.offer.title }}</strong> ({{ data.offer.number }})
      </p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Komentarz (opcjonalnie)</mat-label>
        <textarea 
          matInput 
          [(ngModel)]="comments" 
          rows="3"
          placeholder="Wprowadź komentarz do wniosku akceptacji">
        </textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Anuluj</button>
      <button 
        mat-raised-button 
        color="primary" 
        [mat-dialog-close]="getDialogResult()">
        Wyślij do akceptacji
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { 
      width: 100%; 
      margin-top: 12px; 
    }
    .offer-info {
      margin: 0 0 16px 0;
      color: #64748b;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferApprovalDialogComponent {
  comments = signal<string>('');

  constructor(
    public dialogRef: MatDialogRef<OfferApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OfferApprovalDialogData
  ) { }

  getDialogResult(): { comments: string } {
    return { comments: this.comments() };
  }
}