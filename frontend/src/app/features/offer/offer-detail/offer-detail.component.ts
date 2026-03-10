import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OfferService } from '../offer.service';
import { Offer } from '../offer.model';
import { OfferApprovalDialogComponent } from '../offer-approval-dialog/offer-approval-dialog.component';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule, MatChipsModule,
    MatDividerModule, MatTableModule, MatTabsModule, MatTooltipModule, MatDialogModule
  ],
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss']
})
export class OfferDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private offerService = inject(OfferService);
  private dialog = inject(MatDialog);

  offer = signal<Offer | undefined>(undefined);
  displayedColumns: string[] = ['name', 'quantity', 'netPrice', 'discount', 'vatRate', 'netAmount', 'vatAmount', 'grossAmount'];
  versionColumns: string[] = ['version', 'createdAt', 'createdBy', 'changes'];
  approvalColumns: string[] = ['status', 'requestedBy', 'requestedAt', 'reviewedBy', 'reviewedAt', 'comments'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.offerService.getOfferById(id);
      this.offer.set(found);
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      draft: 'status-draft',
      sent: 'status-sent',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
      expired: 'status-expired'
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      draft: 'Szkic',
      sent: 'Wysłana',
      accepted: 'Zaakceptowana',
      rejected: 'Odrzucona',
      expired: 'Wygasła'
    };
    return map[status] || status;
  }

  getApprovalStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    return map[status] || '';
  }

  onRequestApproval() {
    const current = this.offer();
    if (!current) return;
    const dialogRef = this.dialog.open(OfferApprovalDialogComponent, {
      width: '500px',
      data: { offer: current }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.offerService.requestApproval(current.id, result.comments);
      }
    });
  }

  onGeneratePdf() {
    console.log('Generuj PDF oferty', this.offer()?.id);
  }
}