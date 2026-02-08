import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MainPageViewComponent } from "../../../core/components/main-page-view/main-page-view.component";
import { PageHeaderComponent } from "../../../core/components/page-header/page-header.component";
import { agreement } from "./mock";

@Component({
    selector: 'app-agreement-details',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './agreement-details.component.html',
    styleUrl: './agreement-details.component.scss',
    standalone: true,
    imports: [
        MainPageViewComponent,
        PageHeaderComponent,
        MatCardModule,
        MatChipsModule,
        MatTableModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        DatePipe,
    ],
})
export class AgreemmentDetailsComponent {
    readonly agreement = signal(agreement);
    displayedColumns: string[] = ['installmentNumber', 'dueDate', 'amount', 'status'];

    // Helper function do określenia klasy CSS dla statusu
    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'active': return 'active';
            case 'expired': return 'expired';
            case 'draft': return 'draft';
            case 'pending': return 'pending';
            default: return '';
        }
    }

    // Helper function dla klasy ryzyka
    getRiskClass(level: string): string {
        return level.toLowerCase();
    }

    // Helper function dla statusu płatności
    getPaymentStatusClass(status: string): string {
        return status.toLowerCase();
    }
}