import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { ErrorsComponent } from "../errors/errors.component";
import { ChipSelectableType } from "./types";

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

export const ChipDefaultValues: ChipSelectableType[] =  [
    { viewData: 'Książka Przychodów i Rozchodów', value: 'KPiR' },
    { viewData: 'Księgi handlowe', value: 'KH' },
    { viewData: 'Ryczałt', value: 'Ryczalt' },
    { viewData: 'Wirtualne biuro pakiet Biuro', value: 'WB Biuro' },
    { viewData: 'Wirtualne biuro pakiet Coworking', value: 'WB Coworking' },
    { viewData: 'Wirtualne biuro pakiet Firma', value: 'WB Firma' },
    { viewData: 'Wirtualne biuro pakiet Skrytka', value: 'WB Skrytka' },
    { viewData: 'Wirtualne biuro pakiet Adres', value: 'WB Adres' },
  ];