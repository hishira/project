import { Filter, FilterType } from "../../core/components/table-filtering/types";

export const userFilters: Filter[] = [{
    filterType: FilterType.Selectable,
    label: 'Role',
    config: {
        options: [{
            label: 'User', value: 'user'
        }, {
            label: 'Admin', value: 'admin'
        },
        {label: 'Super admin', value: 'superadmin'},
        {label: 'Manager', value: 'manager'},
        {label: 'Employee', value: 'employee'},
        {label: 'Unknown', value: 'unknown'},
        {label: 'Guest', value: 'guest'}
    ]
    }
}];