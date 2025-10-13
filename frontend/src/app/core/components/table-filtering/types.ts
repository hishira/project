export enum FilterType {
  Selectable,
  Text,
  Date,
  DateRange,
  Number,
  NumberRange,
  NumberExtend,
}
export interface FilterConfig {}
export type FilterOption = {
label: string; value: any
}
export interface SelectableFilterConfig extends FilterConfig {
  options: FilterOption[];
}
export interface Filter {
  filterType: FilterType;
  label: string;
  config: FilterConfig;
}
