import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Offer } from '../offer.model';

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
      <p>Oferta: <strong>{{ data.offer.title }}</strong> ({{ data.offer.number }})</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Komentarz (opcjonalnie)</mat-label>
        <textarea matInput [(ngModel)]="comments" rows="3"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Anuluj</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="{ comments: comments }">Wyślij do akceptacji</button>
    </mat-dialog-actions>
  `,
  styles: ['.full-width { width: 100%; margin-top: 12px; }']
})
export class OfferApprovalDialogComponent {
  comments = '';
  constructor(
    public dialogRef: MatDialogRef<OfferApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { offer: Offer }
  ) { }
}