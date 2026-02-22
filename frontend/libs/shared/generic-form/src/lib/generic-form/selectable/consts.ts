import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DatabaseTranslationPipe } from '../pipes/database-types-translation.pipe';
import { ErrorsComponent } from '../errors/errors.component';

export const Imports = [
  ReactiveFormsModule,
  MatSelectModule,
  MatInputModule,
  NgFor,
  FormsModule,
  MatFormFieldModule,
  DatabaseTranslationPipe,
  NgIf,
  ErrorsComponent,
];
