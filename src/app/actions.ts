'use server';

import { Smoothie } from '@/lib/types/smoothie';
import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';

export async function deleteAuthCookie() {
  (await cookies()).delete('user_id');
}

export async function getUserSmoothies() {
  const userId = (await cookies()).get('user_id')?.value;
  if (userId) {
    const sql = neon(process.env.DATABASE_URL as string);
    // Query to get smoothies with nested ingredients in json format
    const [response] = await sql`WITH ingredient_list AS (
    SELECT 
      s.smoothie_id,
      json_agg(
        json_build_object(
          'smoothieIngredientId', i.ingredient_id,
          'name', i.ingredient_name,
          'quantity', si.amount,
          'unit', si.unit
        )
      ) as ingredients
    FROM smoothies s
    JOIN smoothie_ingredients si ON s.smoothie_id = si.smoothie_id
    JOIN ingredient i ON si.ingredient_id = i.ingredient_id
    GROUP BY s.smoothie_id
    )
    SELECT json_agg(
      json_build_object(
        'smoothieId', s.smoothie_id,
        'name', s.name,
        'ingredients', COALESCE(il.ingredients, '[]'::json)
      ) 
    ) as smoothies
    FROM smoothies s
    LEFT JOIN ingredient_list il ON s.smoothie_id = il.smoothie_id
    WHERE s.user_id = ${+userId};`;
    return response.smoothies;
  }
}

// Creates or updates a smoothie with ingredients
export async function addSmoothies({
  smoothieId,
  name,
  ingredients,
}: Smoothie) {
  const userId = (await cookies()).get('user_id')?.value;
  const sql = neon(process.env.DATABASE_URL as string);

  if (!userId) {
    return new Error('User not authenticated');
  }

  try {
    // Create new smoothie if no ID provided
    if (!smoothieId) {
      const [newSmoothie] =
        await sql`INSERT INTO smoothies (name, user_id) VALUES (${name}, ${+userId})
      RETURNING smoothie_id`;

      smoothieId = newSmoothie.smoothie_id;
    }

    // Update existing smoothie name
    if (smoothieId) {
      await sql`
      UPDATE smoothies
      SET name = ${name}, updated_at = CURRENT_TIMESTAMP
      WHERE smoothies.user_id = ${+userId} AND smoothies.smoothie_id = ${smoothieId}`;

      // Remove old ingredients
      await sql`
          DELETE FROM smoothie_ingredients 
          WHERE smoothie_id = ${smoothieId}`;
    }

    for (const ingredient of ingredients) {
      const [ing] = await sql`
          INSERT INTO ingredient (ingredient_name)
          VALUES (${ingredient.name})
          ON CONFLICT (ingredient_name) 
          DO UPDATE SET ingredient_name = EXCLUDED.ingredient_name
          RETURNING ingredient_id
        `;

      await sql`
          INSERT INTO smoothie_ingredients 
          (smoothie_id, ingredient_id, amount, unit)
          VALUES (
            ${smoothieId},
            ${ing.ingredient_id}, 
            ${ingredient.quantity}, 
            ${ingredient.unit}
          )`;
    }

    return { success: true, smoothie: { smoothieId, name, ingredients } };
  } catch (error) {
    console.error('Error adding/updating smoothie:', error);
    return { success: false, error: 'Failed to save smoothie' };
  }
}

export async function deleteSmoothie(smoothieId: number | null) {
  if (smoothieId) {
    const sql = neon(process.env.DATABASE_URL as string);

    // Delete ingredients first due to foreign key constraints
    await sql`
    DELETE FROM smoothie_ingredients 
    WHERE smoothie_id = ${smoothieId}`;

    await sql`DELETE FROM smoothies WHERE smoothie_id = ${smoothieId}`;
  }
  return;
}
