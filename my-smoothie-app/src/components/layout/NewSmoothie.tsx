'use client';
import { useState } from 'react';
import { Ingredient } from '@/lib/types/smoothie';

export default function NewSmoothie() {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: '', unit: 'cup(s)' },
  ]);
  const [error, setError] = useState('');

  const units = ['cup(s)', 'oz', 'tbsp(s)'];

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: '', quantity: '', unit: 'cup(s)' },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    key: keyof Ingredient,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a smoothie name');
      return;
    }

    const hasEmptyIngredient = ingredients.some(
      (ing) => !ing.name.trim() || !ing.quantity.trim()
    );
    if (hasEmptyIngredient) {
      setError('Please fill in all ingredient fields');
      return;
    }
    console.log({ name, ingredients });
    setName('');
    setIngredients([{ name: '', quantity: '', unit: 'cup(s)' }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="smoothie-name">Smoothie Name</label>
        <input
          id="smoothie-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter smoothie name"
        />
      </div>

      <div>
        <div>
          <label>Ingredients</label>
          <button type="button" onClick={handleAddIngredient}>
            +Add Ingredient
          </button>
        </div>

        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={`ingredient-${index}`}>
              <div>
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, 'name', e.target.value)
                  }
                  placeholder="Ingredient name"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, 'quantity', e.target.value)
                  }
                  placeholder="Amount"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="w-24">
                <select
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(index, 'unit', e.target.value)
                  }
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
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

      {error && <div>{error}</div>}

      <div>
        <button type="submit">Save Smoothie</button>
      </div>
    </form>
  );
}
