import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Campaign } from '../../marketing.models';
import { CampaignListItemComponent } from '../campaign-list-item/campaign-list-item.component';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-recent-campaigns-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatList, RouterLink, CampaignListItemComponent, MatButtonModule],
  templateUrl: './recent-campaigns-list.component.html',
  styleUrls: ['./recent-campaigns-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentCampaignsListComponent {
  campaigns = input.required<Campaign[]>();
}
