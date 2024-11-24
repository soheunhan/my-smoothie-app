'use client';
import { useState } from 'react';
import { Smoothie } from '@/lib/types/smoothie';
import SmoothieForm from './SmoothieForm';

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

  if (smoothies.length === 0) {
    return (
      <div>
        <p>No smoothies yet. Create your first recipe!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {smoothies.map((smoothie, index) => (
        <li key={`smoothie-${index}`} className="border p-4 rounded">
          <div>
            <div className="flex justify-between items-center">
              {editingIndex === index ? (
                <SmoothieForm
                  initialSmoothie={smoothie}
                  handleAddSmoothie={(editedSmoothie) => {
                    handleUpdateSmoothie(index, editedSmoothie);
                    setEditingIndex(null);
                  }}
                  handleCancel={() => setEditingIndex(null)}
                />
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{smoothie.name}</h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingIndex(index)}>Edit</button>
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
                    <button
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                    >
                      {expandedIndex === index ? 'Close' : 'Expand'}
                    </button>
                  </div>
                </>
              )}
            </div>

            {expandedIndex === index && !editingIndex && (
              <div className="mt-4">
                <ul className="space-y-1">
                  {smoothie.ingredients.map((ingredient, i) => (
                    <li key={`${smoothie.name}-ingredient-${i}`}>
                      {ingredient.quantity} {ingredient.unit} of{' '}
                      {ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
