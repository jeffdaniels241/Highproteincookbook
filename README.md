# Virtual Cookbook Library

163 high-protein recipes across 5 categories. Vite-based, deploys to GitHub Pages via GitHub Actions.

## Dev

```bash
npm install
npm run dev        # http://localhost:5173/Highproteincookbook/
npm run build      # output → dist/
```

## Adding or Editing Recipes

All recipe data lives in `src/data/`. Edit the relevant file, save, and push to `main` — GitHub Actions will rebuild and deploy automatically.

| File | Category |
|---|---|
| `src/data/breads.js` | Oven breads (IDs 1–39) |
| `src/data/rcbreads.js` | Rice cooker breads (IDs 301–322) |
| `src/data/cooker.js` | RC Mains + RC Breakfast (IDs 100–149) |
| `src/data/protein.js` | High-Protein System (IDs 200–251) |

### Recipe object shape

```js
{
  id: 99,                    // unique integer
  title: 'My Recipe',        // prefix ⚡ for Protein+ flagging
  cat: 'High-Protein',       // 'Bread' | 'RC-Breads' | 'Rice-Cooker' | 'RC-Breakfast' | 'High-Protein'
  baseS: 4,                  // base servings
  satiety: 4,                // 1–5
  texture: 'Creamy',
  isProteinPlus: false,
  ingredients: ['1c Greek Yogurt', '1 scoop Whey Protein'],
  instructions: ['Mix well.', 'Chill 30m.'],
  proteinRec: 'Pair with: Chicken',  // optional — shows amber callout box
  calories: 320,             // optional macros (per serving)
  protein: 38,
  carbs: 12,
  fat: 8,
}
```

Tags are auto-generated — no need to set them manually.

## Firebase (disabled)

Firebase/cloud sync is currently turned off. The `src/js/firebase.js` and `src/js/cloud.js` files are preserved if you want to re-enable later. Favorites and pantry state persist to `localStorage`.
