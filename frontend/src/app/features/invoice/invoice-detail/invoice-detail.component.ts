import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Invoice } from '../invoice.model';
import { InvoiceService } from '../invoice.service';
import { PaymentDialogComponent } from '../payment-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { ActionItem } from '../../../core/components/more-action-button/action.model';
import { ActionButtonsComponent } from '../../../core/components/more-action-button/more-action-button.component';
import { InvoiceSummaryComponent } from './invoice-summary/invoice-summary.component';
import { InvoiceItemsTableComponent } from './invoice-items-table/invoice-items-table.component';
import { PaymentsTableComponent } from './payments-table/payments-table.component';

@Component({
    selector: 'app-invoice-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatDividerModule,
        MatTableModule,
        MatTabsModule,
        MatDialogModule,
        MainPageViewComponent,
        PageHeaderComponent,
        MatMenuModule,
        ActionButtonsComponent,
        InvoiceSummaryComponent,
        InvoiceItemsTableComponent,
        PaymentsTableComponent,
    ],
    templateUrl: './invoice-detail.component.html',
    styleUrls: ['./invoice-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly invoiceService = inject(InvoiceService);
    private readonly dialog = inject(MatDialog);

    readonly invoice = signal<Invoice | undefined>(undefined);

    moreButtons: ActionItem[] = [
        {
            label: 'Wyślij przypomnienie',
            icon: 'notifications',
            disabled: true,
            handler: () => this.onSendReminder(),
        }, {
            label: 'Wystaw notę korygującą',
            icon: 'post_add',
            handler: () => this.onGenerateCreditNote(),
        }
    ]

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const found = this.invoiceService.getInvoiceById(id);
            this.invoice.set(found);
        }
    }

    onRegisterPayment() {
        const dialogRef = this.dialog.open(PaymentDialogComponent, {
            width: '500px',
            data: { invoice: this.invoice() }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Nowa płatność:', result);
                this.invoiceService.registerPayment(this.invoice()!.id, result);
            }
        });
    }

    onGenerateDuplicate() {
        console.log('Generuj duplikat faktury', this.invoice()?.id);
    }

    onGenerateCreditNote() {
        console.log('Generuj notę korygującą');
    }

    onSendReminder() {
        console.log('Wyślij przypomnienie o płatności');
    }
}