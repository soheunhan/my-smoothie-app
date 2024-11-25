'use client';
import { useState, useEffect } from 'react';
import { SmoothieIngredient, Smoothie } from '@/lib/types/smoothie';
import { addSmoothies } from '@/app/actions';

type SmoothieFormProps = {
  initialSmoothie?: Smoothie;
  handleAddSmoothie: (smoothie: Smoothie) => void;
  handleCancel?: () => void;
  existingSmoothies: Smoothie[];
};

export default function SmoothieForm({
  initialSmoothie,
  handleAddSmoothie,
  handleCancel,
  existingSmoothies,
}: SmoothieFormProps) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<SmoothieIngredient[]>([
    { smoothieIngredientId: null, name: '', quantity: 0, unit: 'cup(s)' },
  ]);
  const [submitError, setSubmitError] = useState('');
  const [nameError, setNameError] = useState('');

  const units = ['cup(s)', 'oz', 'tbsp(s)'];

  // Initialize form with existing smoothie data if provided
  useEffect(() => {
    if (initialSmoothie) {
      setName(initialSmoothie.name);
      setIngredients(initialSmoothie.ingredients);
    }
  }, [initialSmoothie]);

  // Name Validation
  const checkDuplicateName = (smoothieName: string): boolean => {
    const normalizedName = smoothieName.trim().toLowerCase();
    return existingSmoothies.some(
      (smoothie) =>
        smoothie.name.toLowerCase() === normalizedName &&
        smoothie.smoothieId !== initialSmoothie?.smoothieId
    );
  };

  // Form input handlers
  const handleNameChange = (newName: string) => {
    setName(newName);
    setNameError('');
    if (newName.trim() && checkDuplicateName(newName)) {
      setNameError('A smoothie with this name already exists');
    }
  };

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

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Validate inputs
    if (!name.trim()) {
      setSubmitError('Please enter a smoothie name');
      return;
    }

    if (checkDuplicateName(name)) {
      setSubmitError('A smoothie with this name already exists');
      return;
    }

    const hasEmptyIngredient = ingredients.some(
      (ing) => !ing.name.trim() || !ing.quantity
    );
    if (hasEmptyIngredient) {
      setSubmitError('Please fill in all ingredient fields');
      return;
    }

    // Save smoothie and reset states form if new
    const smoothieId = initialSmoothie ? initialSmoothie.smoothieId : null;
    await addSmoothies({ smoothieId, name, ingredients });
    handleAddSmoothie({ smoothieId, name, ingredients });

    if (!initialSmoothie) {
      setName('');
      setIngredients([
        { smoothieIngredientId: null, name: '', quantity: 0, unit: 'cup(s)' },
      ]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="smoothie-name" className="font-bold">
          Smoothie Name
        </label>
        <input
          id="smoothie-name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Enter smoothie name"
          className={`w-full ${
            nameError ? 'border-red-500' : ''
          } mt-2 py-1 px-4 rounded-full text-foreground`}
        />
        {nameError && (
          <div className="text-red-500 text-sm mt-1">{nameError}</div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="ingredients" className="font-bold">
            Ingredients
          </label>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="text-sm"
          >
            + Add Ingredient
          </button>
        </div>

        <ul className="flex flex-col gap-4">
          {ingredients.map((ingredient, index) => (
            <li key={`ingredient-${index}`} className="flex gap-2 items-center">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, 'name', e.target.value)
                }
                placeholder="Ingredient name"
                className="flex-1 py-1 px-4 rounded-full text-foreground"
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
                className="w-24 py-1 px-4 rounded-full text-foreground"
              />
              <select
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, 'unit', e.target.value)
                }
                className="w-24 py-1 px-4 rounded-full text-foreground"
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

      {submitError && <div className="text-red-500">{submitError}</div>}

      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          className={`${
            handleCancel
              ? 'w-1/2 p-2 bg-background text-foreground'
              : 'w-full p-4 bg-foreground text-white'
          }  rounded-full font-bold`}
        >
          {initialSmoothie ? 'Update' : 'Save'}
        </button>
        {handleCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 border-background border p-2 rounded-full"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
