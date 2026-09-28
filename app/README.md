# Hearth — a recipe app

A small, attractive recipe browser built with React + Vite. Search recipes, filter by
category, save favorites, and scale ingredient amounts up or down by serving size.

## Features

- Search recipes by name
- Filter by category (Breakfast, Light Meals, Mains, Sweets)
- Save favorites (stored in your browser, persists between visits)
- Recipe detail view with a serving-size stepper that scales every ingredient amount
- Checkable ingredient list and a numbered method
- Responsive layout, works on mobile and desktop

## Getting started

You'll need [Node.js](https://nodejs.org) (version 18 or later) installed.

```bash
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`) in your browser.

## Building for production

```bash
npm run build
npm run preview
```

`npm run build` outputs a static site into the `dist/` folder, which you can deploy
anywhere that serves static files (Netlify, Vercel, GitHub Pages, a plain web server).

## Adding your own recipes

Open `src/data/recipes.js` and add a new object to the `recipes` array, following the
same shape as the existing entries (title, category, time, servings, ingredients, steps).
It will show up automatically.

## Project structure

```
src/
  App.jsx                 main app: search, filters, layout
  components/
    RecipeCard.jsx         recipe grid card
    RecipeDetail.jsx       recipe detail overlay with serving scaler
  data/recipes.js          recipe content
  styles.css               all styling
```
