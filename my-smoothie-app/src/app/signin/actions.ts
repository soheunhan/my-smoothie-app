'use server';

import { cookies } from 'next/headers';
import { neon } from '@neondatabase/serverless';

export async function setAuthCookie(data: string) {
  const cookieStore = await cookies();
  cookieStore.set('user_id', data, { secure: true });
}

export async function signin(username: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Check if user exists
    let user = await sql`
        SELECT user_id, username, created_at
        FROM users 
        WHERE username = ${username}`;

    // If user doesn't exist, create new user
    if (user.length === 0) {
      user = await sql`
          INSERT INTO users (username)
          VALUES (${username})
          RETURNING user_id, username, created_at`;
    }

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Failed to process login');
  }
}
