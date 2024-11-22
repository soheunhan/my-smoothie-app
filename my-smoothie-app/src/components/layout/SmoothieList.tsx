'use client';
import { useState } from 'react';
import { Smoothie, Ingredient } from '@/lib/types/smoothie';

type SmoothieListProps = {
  smoothies: Smoothie[];
  handleDeleteSmoothie: (index: number) => void;
  handleUpdateSmoothie: (index: number, editedSmoothie: Smoothie) => void;
};

export default function SmoothieList({
  smoothies,
  handleDeleteSmoothie,
  handleUpdateSmoothie,
}: SmoothieListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedSmoothie, setEditedSmoothie] = useState<Smoothie | null>(null);

  const units = ['cup(s)', 'oz', 'tbsp(s)'];

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditedSmoothie({ ...smoothies[index] });
    setExpandedIndex(index);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditedSmoothie(null);
  };

  const saveEditing = (index: number) => {
    if (editedSmoothie) {
      handleUpdateSmoothie(index, editedSmoothie);
      setEditingIndex(null);
      setEditedSmoothie(null);
    }
  };

  const updateIngredient = (
    ingredientIndex: number,
    key: keyof Ingredient,
    value: string
  ) => {
    if (!editedSmoothie) return;

    const updatedIngredients = editedSmoothie.ingredients.map((ing, i) =>
      i === ingredientIndex ? { ...ing, [key]: value } : ing
    );

    setEditedSmoothie({
      ...editedSmoothie,
      ingredients: updatedIngredients,
    });
  };

  const addIngredient = () => {
    if (!editedSmoothie) return;

    setEditedSmoothie({
      ...editedSmoothie,
      ingredients: [
        ...editedSmoothie.ingredients,
        { name: '', quantity: '', unit: 'cup(s)' },
      ],
    });
  };

  const removeIngredient = (ingredientIndex: number) => {
    if (!editedSmoothie) return;

    setEditedSmoothie({
      ...editedSmoothie,
      ingredients: editedSmoothie.ingredients.filter(
        (_, i) => i !== ingredientIndex
      ),
    });
  };

  if (smoothies.length === 0) {
    return (
      <div>
        <p>No smoothies yet. Create your first recipe!</p>
      </div>
    );
  }

  return (
    <ul>
      {smoothies.map((smoothie, index) => (
        <li key={`smoothie-${index}`}>
          <div>
            <div>
              <div>
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editedSmoothie?.name || ''}
                    onChange={(e) =>
                      setEditedSmoothie((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                  />
                ) : (
                  <h3 className="text-lg font-semibold">{smoothie.name}</h3>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editingIndex === index ? (
                  <>
                    <button onClick={() => saveEditing(index)}>Save </button>
                    <button onClick={cancelEditing}>X </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(index)}>Edit </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to delete this smoothie?'
                          )
                        ) {
                          handleDeleteSmoothie(index);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  {expandedIndex === index ? 'close' : 'expand'}
                </button>
              </div>
            </div>

            {(expandedIndex === index || editingIndex === index) && (
              <div>
                <div>
                  {(editingIndex === index && editedSmoothie
                    ? editedSmoothie.ingredients
                    : smoothie.ingredients
                  ).map((ingredient, i) => (
                    <div key={`${smoothie.name}-ingredient-${i}`}>
                      {editingIndex === index ? (
                        <>
                          <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) =>
                              updateIngredient(i, 'name', e.target.value)
                            }
                            placeholder="Ingredient name"
                          />
                          <input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) =>
                              updateIngredient(i, 'quantity', e.target.value)
                            }
                            placeholder="Amount"
                            min="0"
                            step="0.1"
                          />
                          <select
                            value={ingredient.unit}
                            onChange={(e) =>
                              updateIngredient(i, 'unit', e.target.value)
                            }
                          >
                            {units.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                          {editedSmoothie!.ingredients.length > 1 && (
                            <button onClick={() => removeIngredient(i)}>
                              X
                            </button>
                          )}
                        </>
                      ) : (
                        <div>
                          <span>
                            {ingredient.quantity} {ingredient.unit} of
                          </span>
                          <span>{ingredient.name}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {editingIndex === index && (
                    <button onClick={addIngredient}>+ Add Ingredient</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
