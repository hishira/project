import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MarketingService } from '../marketing.service';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { getCampaignStatusClass, getCampaignTypeIcon, campaignListColumns } from '../marketing.constants';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MainPageViewComponent,
    PageHeaderComponent,
  ],
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListComponent {
  private readonly marketingService = inject(MarketingService);
  readonly campaigns = this.marketingService.campaigns;

  readonly displayedColumns = campaignListColumns;

  readonly getTypeIcon = getCampaignTypeIcon;
  readonly getStatusClass = getCampaignStatusClass;
}
