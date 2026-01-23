import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { ErrorsComponent } from "../errors/errors.component";

export const Imports = [
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  FormsModule,
  ReactiveFormsModule,
  MatChipsModule,
  MatIconModule,
  ErrorsComponent,
]