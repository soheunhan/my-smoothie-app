'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthCookie, signin } from '@/app/signin/actions';

export default function Signin() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await signin(username);
      await setAuthCookie(user[0].user_id);

      router.push('/');
    } catch (err) {
      setError('Failed to login. Please try again.');
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 flex flex-col gap-10 justify-center items-center">
      <div className="flex flex-col gap-4 items-center justify-center">
        <h2>Welcome to Smoothie App</h2>
        <p className="text-xl font-bold">please sign in to continue!</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <label className="font-bold">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full py-1 px-4 rounded-full"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full p-2 bg-foreground text-white rounded-full font-bold"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
