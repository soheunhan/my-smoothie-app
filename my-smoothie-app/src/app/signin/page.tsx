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
    <div>
      <h2>Welcome to Smoothie App</h2>
      <p>please sign in to continue!</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
