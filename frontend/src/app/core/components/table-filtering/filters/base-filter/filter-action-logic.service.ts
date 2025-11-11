import { Injectable } from "@angular/core";
import { BaseFilterComponent } from "./base-filter.component";

@Injectable()
export class FilterActionLogic{
    currentFilters: BaseFilterComponent<any>[] = [];

    addFilter(filter: BaseFilterComponent<any>): void {
        this.currentFilters.push(filter);
    }
}