import { inject, Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog'

@Injectable()
export class ModalService {
    private readonly dialog = inject(MatDialog)

    open(component: any, data?: any): void {
        this.dialog.open(component, data);
    }
}