import NewSmoothie from '@/components/layout/NewSmoothie';
import SmoothieList from '@/components/layout/SmoothieList';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h2 className="text-2xl font-bold mb-6">Create New Smoothie</h2>
          <NewSmoothie />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">My Smoothies</h2>
          <SmoothieList />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
