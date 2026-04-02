import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Offer } from '../../offer.model';

@Component({
  selector: 'app-offer-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink],
  templateUrl: './offer-actions.component.html',
  styleUrls: ['./offer-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferActionsComponent {
  offer = input.required<Offer>();

  view = output<void>();
  edit = output<void>();
  delete = output<void>();

  onView() {
    this.view.emit();
  }

  onEdit(event: MouseEvent) {
    event.stopPropagation();
    this.edit.emit();
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit();
  }
}
