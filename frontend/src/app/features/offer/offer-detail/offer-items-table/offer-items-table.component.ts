import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { OfferItem } from '../../offer.model';

@Component({
  selector: 'app-offer-items-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  template: `
    <mat-card class="items-card">
      <mat-card-header>
        <mat-card-title>Pozycje oferty</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="items()" class="items-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nazwa</th>
            <td mat-cell *matCellDef="let item">{{ item.name }}</td>
          </ng-container>
          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Ilość</th>
            <td mat-cell *matCellDef="let item">{{ item.quantity }} {{ item.unit }}</td>
          </ng-container>
          <ng-container matColumnDef="netPrice">
            <th mat-header-cell *matHeaderCellDef>Cena netto</th>
            <td mat-cell *matCellDef="let item">{{ item.netPrice | number: '1.2-2' }}</td>
          </ng-container>
          <ng-container matColumnDef="discount">
            <th mat-header-cell *matHeaderCellDef>Rabat %</th>
            <td mat-cell *matCellDef="let item">{{ item.discountPercent ?? 0 }}%</td>
          </ng-container>
          <ng-container matColumnDef="vatRate">
            <th mat-header-cell *matHeaderCellDef>VAT %</th>
            <td mat-cell *matCellDef="let item">{{ item.vatRate }}%</td>
          </ng-container>
          <ng-container matColumnDef="netAmount">
            <th mat-header-cell *matHeaderCellDef>Netto</th>
            <td mat-cell *matCellDef="let item">{{ item.netAmount | number: '1.2-2' }}</td>
          </ng-container>
          <ng-container matColumnDef="vatAmount">
            <th mat-header-cell *matHeaderCellDef>VAT</th>
            <td mat-cell *matCellDef="let item">{{ item.vatAmount | number: '1.2-2' }}</td>
          </ng-container>
          <ng-container matColumnDef="grossAmount">
            <th mat-header-cell *matHeaderCellDef>Brutto</th>
            <td mat-cell *matCellDef="let item">{{ item.grossAmount | number: '1.2-2' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .items-table {
      width: 100%;
      margin-top: 8px;
    }
  `]
})
export class OfferItemsTableComponent {
  items = input.required<OfferItem[]>();
  displayedColumns: string[] = ['name', 'quantity', 'netPrice', 'discount', 'vatRate', 'netAmount', 'vatAmount', 'grossAmount'];
}
