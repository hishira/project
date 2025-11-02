export type Optional<T> = T | null | undefined;
type RecursivePartial<T> = {
  [P in keyof T]: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
type Tuple<T, U> = [T, U];
