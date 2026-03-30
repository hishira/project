import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DocumentType } from '../../document.models';
import { DOCUMENT_TYPE_OPTIONS } from '../../document.utils';

@Component({
  selector: 'app-document-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './document-filters.component.html',
  styleUrls: ['./document-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentFiltersComponent {
  filterType = input<DocumentType | ''>('');
  filterClient = input<string>('');
  filterDateFrom = input<Date | null>(null);
  filterDateTo = input<Date | null>(null);

  filterTypeChange = output<DocumentType | ''>();
  filterClientChange = output<string>();
  filterDateFromChange = output<Date | null>();
  filterDateToChange = output<Date | null>();
  clearFilters = output<void>();

  readonly documentTypes = DOCUMENT_TYPE_OPTIONS;
}
