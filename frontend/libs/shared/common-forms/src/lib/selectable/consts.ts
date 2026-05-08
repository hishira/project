import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ErrorsComponent } from '../errors/errors.component';
import { DatabaseTranslationPipe } from '../pipes/database-types-translation.pipe';

export const Imports = [
  ReactiveFormsModule,
  MatSelectModule,
  MatInputModule,
  FormsModule,
  MatFormFieldModule,
  DatabaseTranslationPipe,
  ErrorsComponent,
];
