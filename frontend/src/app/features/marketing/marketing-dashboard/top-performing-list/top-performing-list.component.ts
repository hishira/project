import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Campaign } from '../../marketing.models';
import { CampaignListItemComponent } from '../campaign-list-item/campaign-list-item.component';

@Component({
  selector: 'app-top-performing-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatList, RouterLink, CampaignListItemComponent],
  templateUrl: './top-performing-list.component.html',
  styleUrls: ['./top-performing-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopPerformingListComponent {
  campaigns = input.required<Campaign[]>();
}
