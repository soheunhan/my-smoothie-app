export type MeasurementUnit = 'cup(s)' | 'oz' | 'tbsp(s)';

export interface SmoothieIngredient {
  smoothieIngredientId: number | null;
  name: string;
  quantity: number;
  unit: MeasurementUnit;
}

export interface Smoothie {
  smoothieId: number | null;
  name: string;
  ingredients: SmoothieIngredient[];
}
