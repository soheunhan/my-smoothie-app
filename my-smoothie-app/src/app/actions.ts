'use server';

import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

async function getUserSmoothies(userId: number) {
  const sql = neon(process.env.DATABASE_URL);
  const smoothies = await sql`
    SELECT 
      smoothie_id,
      name,
      created_at,
      updated_at
    FROM smoothies 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC`;

  return smoothies;
}

export async function deleteAuthCookie() {
  (await cookies()).delete('user_id');
}
