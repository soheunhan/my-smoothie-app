'use client';
import { useState } from 'react';
import { Smoothie } from '@/lib/types/smoothie';

export default function SmoothieList() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  //example smoothies
  const smoothies: Smoothie[] = [
    {
      name: 'banana smoothie',
      ingredients: [{ name: 'banana', quantity: '3', unit: 'cup(s)' }],
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
                <h3>{smoothie.name}</h3>
                <span>{smoothie.ingredients.length} ingredients</span>
              </div>

              <div>
                <button>Edit</button>
                <button onClick={() => {}}>Delete</button>
                <button onClick={() => toggleExpand(index)}>
                  {expandedIndex === index ? 'expand' : 'close'}
                </button>
              </div>
            </div>

            {expandedIndex === index && (
              <div>
                <h4>Ingredients:</h4>
                <ul>
                  {smoothie.ingredients.map((ingredient, i) => (
                    <li key={`${smoothie.name}-ingredient-${i}`}>
                      <span>
                        {ingredient.quantity} {ingredient.unit} of
                      </span>
                      <span>{ingredient.name}</span>
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
