import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { MainPageViewComponent } from "../../../core/components/main-page-view/main-page-view.component";
import { PageHeaderComponent } from "../../../core/components/page-header/page-header.component";
import { TicketAttachmentsComponent } from "./ticket-attachments/ticket-attachments.component";
import { TicketComments } from "./ticket-comments/ticket-comments.component";
import { TicketMetadataComponent } from "./ticket-metadata/ticket-metadata.component";

export const imports = [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PageHeaderComponent,
    MainPageViewComponent,
    TicketMetadataComponent,
    TicketAttachmentsComponent,
    TicketComments,
]