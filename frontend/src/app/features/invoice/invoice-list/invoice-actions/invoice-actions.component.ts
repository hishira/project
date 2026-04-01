import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Invoice } from '../../invoice.model';

@Component({
  selector: 'app-invoice-actions',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink],
  templateUrl: './invoice-actions.component.html',
  styleUrls: ['./invoice-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceActionsComponent {
  invoice = input.required<Invoice>();

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
