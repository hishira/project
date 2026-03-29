import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Campaign } from '../../marketing.models';
import { getCampaignStatusClass, getCampaignTypeIcon, getCampaignTypeColor } from '../../marketing.utils';

@Component({
  selector: 'app-campaign-list-item',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './campaign-list-item.component.html',
  styleUrls: ['./campaign-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignListItemComponent {
  campaign = input.required<Campaign>();
  showRank = input<boolean>(false);
  rank = input<number>(0);
  showStats = input<boolean>(false);

  protected getCampaignStatusClass = getCampaignStatusClass;
  protected getCampaignTypeIcon = getCampaignTypeIcon;
  protected getCampaignTypeColor = getCampaignTypeColor;
}
