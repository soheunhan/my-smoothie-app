'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SmoothieList from '@/components/layout/SmoothieList';
import SmoothieForm from '@/components/layout/SmoothieForm';
import { Smoothie } from '@/lib/types/smoothie';
import {
  deleteAuthCookie,
  getUserSmoothies,
  deleteSmoothie,
} from '@/app/actions';

export default function Home() {
  const [smoothies, setSmoothies] = useState<Smoothie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSmoothies = async () => {
      try {
        setLoading(true);
        const data = await getUserSmoothies();
        setSmoothies(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load smoothies'
        );
        console.error('Error fetching smoothies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSmoothies();
  }, []);

  const handleAddSmoothie = (newSmoothie: Smoothie) => {
    setSmoothies((prev) => [...prev, newSmoothie]);
  };

  const handleDeleteSmoothie = async (index: number) => {
    await deleteSmoothie(smoothies[index].smoothieId);
    setSmoothies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateSmoothie = (index: number, updated: Smoothie) => {
    setSmoothies((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  const handleSignOut = async () => {
    await deleteAuthCookie();
    router.push('/signin');
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h2 className="text-2xl font-bold mb-6">Create New Smoothie</h2>
          <SmoothieForm handleAddSmoothie={handleAddSmoothie} />
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
      <footer className="mt-20">
        <button onClick={handleSignOut}>Sign Out</button>
      </footer>
    </div>
  );
}
