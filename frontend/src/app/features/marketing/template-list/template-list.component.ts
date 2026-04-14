// template-list.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarketingService } from '../marketing.service';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { getCampaignTypeIcon, formatDatePolish, templateListColumns } from '../marketing.constants';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule,
    MainPageViewComponent,
    PageHeaderComponent
  ],
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateListComponent {
  private readonly marketingService = inject(MarketingService);
  readonly templates = this.marketingService.templates;

  readonly displayedColumns = templateListColumns;

  readonly getTypeIcon = getCampaignTypeIcon;
  readonly formatDate = formatDatePolish;

  getTypeClass(type: string): string {
    return `type-${type}`;
  }
}
