import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  readonly filterType = input<DocumentType | ''>('');
  readonly filterClient = input<string>('');
  readonly filterDateFrom = input<Date | null>(null);
  readonly filterDateTo = input<Date | null>(null);

  readonly filterTypeChange = output<DocumentType | ''>();
  readonly filterClientChange = output<string>();
  readonly filterDateFromChange = output<Date | null>();
  readonly filterDateToChange = output<Date | null>();
  readonly clearFilters = output<void>();

  readonly documentTypes = DOCUMENT_TYPE_OPTIONS;
}
