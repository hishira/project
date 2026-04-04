import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OfferService } from '../offer.service';
import { Offer } from '../offer.model';
import { OfferApprovalDialogComponent, OFFER_APPROVAL_DIALOG_CONFIG } from '../offer-approval-dialog/offer-approval-dialog.component';
import { OfferSummaryComponent } from './offer-summary/offer-summary.component';
import { OfferItemsTableComponent } from './offer-items-table/offer-items-table.component';
import { OfferVersionsTabComponent } from './offer-versions-tab/offer-versions-tab.component';
import { OfferApprovalsTabComponent } from './offer-approvals-tab/offer-approvals-tab.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule, MatTabsModule, MatDialogModule,
    OfferSummaryComponent, OfferItemsTableComponent,
    OfferVersionsTabComponent, OfferApprovalsTabComponent,
    PageHeaderComponent, MainPageViewComponent
  ],
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfferDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private offerService = inject(OfferService);
  private dialog = inject(MatDialog);

  offer = signal<Offer | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.offerService.getOfferById(id);
      this.offer.set(found);
    }
  }

  onRequestApproval() {
    const current = this.offer();
    if (!current) return;
    const dialogRef = this.dialog.open(OfferApprovalDialogComponent, {
      ...OFFER_APPROVAL_DIALOG_CONFIG,
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