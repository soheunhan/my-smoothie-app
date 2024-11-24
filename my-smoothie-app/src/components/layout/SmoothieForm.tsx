'use client';
import { useState, useEffect } from 'react';
import { SmoothieIngredient, Smoothie } from '@/lib/types/smoothie';
import { addSmoothies } from '@/app/actions';

type SmoothieFormProps = {
  initialSmoothie?: Smoothie;
  handleAddSmoothie: (smoothie: Smoothie) => void;
  handleCancel?: () => void;
};

export default function SmoothieForm({
  initialSmoothie,
  handleAddSmoothie,
  handleCancel,
}: SmoothieFormProps) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<SmoothieIngredient[]>([
    { smoothieIngredientId: null, name: '', quantity: 0, unit: 'cup(s)' },
  ]);
  const [error, setError] = useState('');

  const units = ['cup(s)', 'oz', 'tbsp(s)'];
  // Initialize form with existing smoothie data if provided
  useEffect(() => {
    if (initialSmoothie) {
      setName(initialSmoothie.name);
      setIngredients(initialSmoothie.ingredients);
    }
  }, [initialSmoothie]);

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { smoothieIngredientId: null, name: '', quantity: 0, unit: 'cup(s)' },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    key: keyof SmoothieIngredient,
    value: string
  ) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [key]: value };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a smoothie name');
      return;
    }

    const hasEmptyIngredient = ingredients.some(
      (ing) => !ing.name.trim() || !ing.quantity
    );
    if (hasEmptyIngredient) {
      setError('Please fill in all ingredient fields');
      return;
    }
    const smoothieId = initialSmoothie ? initialSmoothie.smoothieId : null;
    await addSmoothies({ smoothieId, name, ingredients });
    handleAddSmoothie({ smoothieId, name, ingredients });

    // Only reset form if it's not being used for editing
    if (!initialSmoothie) {
      setName('');
      setIngredients([
        { smoothieIngredientId: null, name: '', quantity: 0, unit: 'cup(s)' },
      ]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="smoothie-name">Smoothie Name</label>
        <input
          id="smoothie-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter smoothie name"
          className="w-full"
        />
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label>Ingredients</label>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="text-sm"
          >
            + Add Ingredient
          </button>
        </div>

        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={`ingredient-${index}`} className="flex gap-2 items-center">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, 'name', e.target.value)
                }
                placeholder="Ingredient name"
                className="flex-1"
              />
              <input
                type="number"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, 'quantity', e.target.value)
                }
                placeholder="Amount"
                min="0"
                step="0.1"
                className="w-24"
              />
              <select
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, 'unit', e.target.value)
                }
                className="w-24"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  X
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="flex gap-2">
        <button type="submit">{initialSmoothie ? 'Update' : 'Save'}</button>
        {handleCancel && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
