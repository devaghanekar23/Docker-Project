import db from './db.js';
import { recipes } from '../src/data/recipes.js';

async function seedDatabase() {
  try {
    console.log('🔄 Data insertion start ho raha hai...');

    for (const recipe of recipes) {
      const { id, title, category, icon, time, difficulty, servings, blurb, ingredients, steps } = recipe;

      const query = `
        INSERT INTO recipes (id, title, category, icon, time, difficulty, servings, blurb, ingredients, steps)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          title = VALUES(title),
          category = VALUES(category),
          icon = VALUES(icon),
          time = VALUES(time),
          difficulty = VALUES(difficulty),
          servings = VALUES(servings),
          blurb = VALUES(blurb),
          ingredients = VALUES(ingredients),
          steps = VALUES(steps);
      `;

      await db.execute(query, [
        id,
        title,
        category,
        icon || '',
        time,
        difficulty || 'Easy',
        servings,
        blurb || '',
        JSON.stringify(ingredients),
        JSON.stringify(steps)
      ]);

      console.log(`✅ Inserted: ${title}`);
    }

    console.log('🎉 Subhi recipes successfully MySQL me insert ho gayi!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration Error:', error);
    process.exit(1);
  }
}

seedDatabase();