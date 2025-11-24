import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MoveBackService } from '../../../services/move-back.service';

@Component({
  selector: 'app-page-back-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-back-button.component.html',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
})
export class PageBackButtonComponent {
  private readonly backService: MoveBackService = inject(MoveBackService);
  onMoveBack(): void {
    this.backService.moveBack().then();
  }
}
