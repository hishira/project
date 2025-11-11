import { Injectable, OnDestroy } from "@angular/core";
import { BaseFilterComponent } from "./base-filter.component";

@Injectable()
export class FilterActionLogic implements OnDestroy{
    currentFilters: BaseFilterComponent<any>[] = [];

    addFilter(filter: BaseFilterComponent<any>): void {
        this.currentFilters.push(filter);
    }

    resetFilterComponent(filterLabel: string): void {
        const component = this.currentFilters.find(f => f.label() === filterLabel);
        component?.resetFilter();
    }

    ngOnDestroy(): void {
        this.currentFilters = [];
    }
}