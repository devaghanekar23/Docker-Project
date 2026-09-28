export const categories = ['Breakfast', 'Light Meals', 'Mains', 'Sweets'];

const API_URL = 'http://localhost:5000/api/recipes';

export const fetchRecipes = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  const data = await response.json();
  
  // MySQL response JSON fields parsing check
  return data.map((recipe) => ({
    ...recipe,
    ingredients: typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients,
    steps: typeof recipe.steps === 'string' ? JSON.parse(recipe.steps) : recipe.steps,
  }));
};

export const fetchRecipeById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Recipe not found');
  const recipe = await response.json();
  return {
    ...recipe,
    ingredients: typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients,
    steps: typeof recipe.steps === 'string' ? JSON.parse(recipe.steps) : recipe.steps,
  };
};

export const createRecipe = async (recipeData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipeData)
  });
  return await response.json();
};

export const updateRecipe = async (id, recipeData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipeData)
  });
  return await response.json();
};

export const deleteRecipe = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return await response.json();
};