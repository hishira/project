import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
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
        ActionButtonsComponent
    ],
    templateUrl: './invoice-detail.component.html',
    styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private invoiceService = inject(InvoiceService);
    private dialog = inject(MatDialog);

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
    invoice = signal<Invoice | undefined>(undefined);
    displayedColumns: string[] = ['name', 'quantity', 'netPrice', 'vatRate', 'netAmount', 'vatAmount', 'grossAmount'];
    paymentColumns: string[] = ['date', 'amount', 'method', 'reference', 'notes'];

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const found = this.invoiceService.getInvoiceById(id);
            this.invoice.set(found);
        }
    }

    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            draft: 'status-draft',
            sent: 'status-sent',
            paid: 'status-paid',
            overdue: 'status-overdue',
            cancelled: 'status-cancelled'
        };
        return map[status] || '';
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = {
            draft: 'Szkic',
            sent: 'Wysłana',
            paid: 'Opłacona',
            overdue: 'Zaległa',
            cancelled: 'Anulowana'
        };
        return map[status] || status;
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