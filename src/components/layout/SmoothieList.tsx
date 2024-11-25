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
  const [searchTerm, setSearchTerm] = useState('');

  // No Smoothie handling
  if (!smoothies || smoothies.length === 0) {
    return (
      <div>
        <p>No smoothies yet. Create your first recipe!</p>
      </div>
    );
  }

  // Filter smoothies based on search
  const filteredSmoothies = smoothies.filter((smoothie) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;

    return smoothie.name.toLowerCase().includes(search);
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <label className="font-bold">Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search smoothies by name"
          className="w-full py-1 px-4 rounded-full text-foreground"
        />
      </div>

      <div className="text-sm my-4">
        Found {filteredSmoothies.length} smoothie
        {filteredSmoothies.length !== 1 ? 's' : ''}
      </div>

      {filteredSmoothies.length === 0 ? (
        <div className="text-center py-8">
          No smoothies found matching &quot;{searchTerm}&quot;
        </div>
      ) : (
        <ul className="flex flex-col gap-6">
          {filteredSmoothies.map((smoothie, index) => (
            <li
              key={`smoothie-${index}`}
              className="bg-foreground p-6 rounded-lg min-w-full"
            >
              {editingIndex === index ? (
                // Edit mode
                <SmoothieForm
                  initialSmoothie={smoothie}
                  handleAddSmoothie={(editedSmoothie) => {
                    handleUpdateSmoothie(index, editedSmoothie);
                    setEditingIndex(null);
                    setExpandedIndex(index);
                  }}
                  handleCancel={() => setEditingIndex(null)}
                  existingSmoothies={smoothies}
                />
              ) : (
                // View mode
                <div className="flex gap-6 justify-between">
                  <h3>{smoothie.name}</h3>
                  <div className="flex items-center gap-2 font-bold">
                    <button
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                    >
                      {expandedIndex === index ? 'Close' : 'Details'}
                    </button>
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
                  </div>
                </div>
              )}

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
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
