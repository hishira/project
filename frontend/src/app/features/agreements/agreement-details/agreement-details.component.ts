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
import { agreementStatusLowerCase } from "./utils";

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
    readonly displayedColumns: string[] = ['installmentNumber', 'dueDate', 'amount', 'status'];

    getStatusClass(status: string): string {
        return agreementStatusLowerCase(status);
    }

    getRiskClass(level: string): string {
        return level.toLowerCase();
    }

    getPaymentStatusClass(status: string): string {
        return status.toLowerCase();
    }
}