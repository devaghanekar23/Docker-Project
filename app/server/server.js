import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// 1. GET ALL RECIPES
app.get('/api/recipes', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM recipes ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET SINGLE RECIPE
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Recipe not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. CREATE NEW RECIPE
app.post('/api/recipes', async (req, res) => {
  try {
    const { id, title, category, icon, time, difficulty, servings, blurb, ingredients, steps } = req.body;
    const query = `
      INSERT INTO recipes (id, title, category, icon, time, difficulty, servings, blurb, ingredients, steps)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(query, [
      id, title, category, icon || '', time, difficulty || 'Easy', servings, blurb || '',
      JSON.stringify(ingredients),
      JSON.stringify(steps)
    ]);
    res.status(201).json({ message: 'Recipe created successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. UPDATE RECIPE
app.put('/api/recipes/:id', async (req, res) => {
  try {
    const { title, category, icon, time, difficulty, servings, blurb, ingredients, steps } = req.body;
    const query = `
      UPDATE recipes 
      SET title = ?, category = ?, icon = ?, time = ?, difficulty = ?, servings = ?, blurb = ?, ingredients = ?, steps = ?
      WHERE id = ?
    `;
    await db.execute(query, [
      title, category, icon || '', time, difficulty || 'Easy', servings, blurb || '',
      JSON.stringify(ingredients),
      JSON.stringify(steps),
      req.params.id
    ]);
    res.json({ message: 'Recipe updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE RECIPE
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM recipes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Recipe deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));