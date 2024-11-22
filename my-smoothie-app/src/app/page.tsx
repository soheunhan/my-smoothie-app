'use client';
import { useState } from 'react';
import NewSmoothie from '@/components/layout/NewSmoothie';
import SmoothieList from '@/components/layout/SmoothieList';
import { Smoothie } from '@/lib/types/smoothie';

export default function Home() {
  const [smoothies, setSmoothies] = useState<Smoothie[]>([]);

  const handleAddSmoothie = (newSmoothie: Smoothie) => {
    setSmoothies((prev) => [...prev, newSmoothie]);
  };

  const handleDeleteSmoothie = (index: number) => {
    setSmoothies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSmoothie = (index: number, updated: Smoothie) => {
    setSmoothies((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h2 className="text-2xl font-bold mb-6">Create New Smoothie</h2>
          <NewSmoothie handleAddSmoothie={handleAddSmoothie} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">My Smoothies</h2>
          <SmoothieList
            smoothies={smoothies}
            handleDeleteSmoothie={handleDeleteSmoothie}
            handleUpdateSmoothie={handleUpdateSmoothie}
          />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
