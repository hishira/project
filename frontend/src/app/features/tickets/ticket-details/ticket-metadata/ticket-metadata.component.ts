import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { TicketDetails } from "../../types";
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
    readonly ticketDetails = input.required<TicketDetails>();

    isCrmTicket(details: TicketDetails): details is TicketDetails & { customer: any; account?: string; channel: string; slaDeadline?: Date; product?: string } {
        return details.type === 'crm';
    }

    isPmIssue(details: TicketDetails): details is TicketDetails & { issueType: string; storyPoints?: number; sprint?: string; affectedVersions?: string[]; fixedVersions?: string[] } {
        return details.type === 'pm';
    }
}