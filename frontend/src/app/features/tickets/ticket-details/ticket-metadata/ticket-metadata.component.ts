import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { CrmTicket, PmIssue, TicketDetails, TicketListItem } from "../../types";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-ticket-metadata',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './ticket-metadata.component.html',
    styleUrl: './ticket-metadata.component.scss',
    standalone: true,
    imports: [
        MatIconModule,
        MatChipsModule,
            CommonModule,

    ],
})
export class TicketMetadataComponent {
    readonly ticketDetails = input.required<any>()
    isCrmTicket(details: TicketDetails): details is CrmTicket & { relatedTickets?: TicketListItem[]; timeTracking?: any; isLoading: boolean; error?: string } {
        return details.type === 'crm';
    }

    isPmIssue(details: TicketDetails): details is PmIssue & { relatedTickets?: TicketListItem[]; timeTracking?: any; isLoading: boolean; error?: string } {
        return details.type === 'pm';
    }
}