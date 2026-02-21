import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatChip } from "@angular/material/chips";
import { MatList, MatListItem } from "@angular/material/list";

@Component({
    selector: 'app-ticket-comments',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './ticket-comments.component.html',
    styleUrl: './ticket-comments.component.scss',
    standalone: true,
    imports: [MatCardModule, MatList, MatChip, DatePipe, MatListItem,]
})
export class TicketComments {
    readonly ticketDetails = input.required<any>();
    readonly comments = computed(() => this.ticketDetails().comments);
}