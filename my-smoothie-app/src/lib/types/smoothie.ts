export interface Ingredient {
  name: string;
  quantity: string;
  unit: MeasurementUnit;
}

export type MeasurementUnit = 'cup(s)' | 'oz' | 'tbsp(s)';

// Main smoothie recipe interface
export interface Smoothie {
  name: string;
  ingredients: Ingredient[];
}
