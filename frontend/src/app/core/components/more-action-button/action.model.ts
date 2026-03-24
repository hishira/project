// shared/models/action.model.ts
export interface ActionItem {
  /** Wyświetlana etykieta */
  label: string;
  /** Ikona Material (nazwa) */
  icon: string;
  /** Funkcja wywoływana po kliknięciu */
  handler: () => void;
  /** Opcjonalny tooltip */
  tooltip?: string;
  /** Czy akcja jest wyłączona */
  disabled?: boolean;
  /** Opcjonalnie – kolor przycisku (primary, warn, itp.) – dla pojedynczej akcji */
  color?: 'primary' | 'accent' | 'warn';
}