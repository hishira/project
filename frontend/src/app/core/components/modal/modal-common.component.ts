import { inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

export const CreateModalData = (modalData: any)=>({
    data: modalData,
})

export class CommonModal<DataType = any>{
    protected readonly data: DataType = inject(MAT_DIALOG_DATA);
}