import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { LoyaltyService } from '../loyalty.service';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { LevelCardComponent } from './level-card/level-card.component';
import { CustomerCellComponent } from './customer-cell/customer-cell.component';
import { LevelBadgeComponent } from './level-badge/level-badge.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@Component({
  selector: 'app-loyalty-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MainPageViewComponent,
    PageHeaderComponent,
    LevelCardComponent,
    CustomerCellComponent,
    LevelBadgeComponent,
    ProgressBarComponent,
  ],
  templateUrl: './loyalty-list.component.html',
  styleUrls: ['./loyalty-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyListComponent {
  private readonly loyaltyService = inject(LoyaltyService);

  readonly customers = this.loyaltyService.customers;
  readonly levels = this.loyaltyService.levels;

  readonly displayedColumns: string[] = ['customer', 'level', 'points', 'nextLevel', 'rewards', 'actions'];

  onAdd(): void {
    // TODO: Implement add customer logic
  }
}