'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { categoryLabels, categoryOrder, recipes, type Recipe, type RecipeCategory } from '../src/data/recipes';
import '../src/css/style.css';

const pantryOptions = ['Cooked Chicken', 'Greek Yogurt', 'Cottage Cheese', 'Rice', 'Oats', 'Bread Flour', 'Whey Protein', 'Lentils', 'Egg Whites'];

function readStored(key: string, fallback: any) {
  if (typeof window === 'undefined') return fallback;
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RecipeCategory | 'all'>('all');
  const [sort, setSort] = useState('recommended');
  const [proteinOnly, setProteinOnly] = useState(false);
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [pantry, setPantry] = useState<string[]>([]);
  const [pantryMode, setPantryMode] = useState<'all' | 'any'>('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showPantry, setShowPantry] = useState(false);
  const [includeVariations, setIncludeVariations] = useState(false);

  useEffect(() => {
    setFavorites(readStored('hpc-favorites-v2', readStored('virtualLibraryFavorites', [])));
    setPantry(readStored('hpc-pantry-v2', readStored('virtualLibraryPantry', [])));
  }, []);
  useEffect(() => { window.localStorage.setItem('hpc-favorites-v2', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { window.localStorage.setItem('hpc-pantry-v2', JSON.stringify(pantry)); }, [pantry]);

  const visibleRecipes = useMemo(() => includeVariations ? recipes : recipes.filter((recipe) => recipe.visibility === 'core'), [includeVariations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = visibleRecipes.filter((recipe) => {
      const matchesQuery = !q || `${recipe.title} ${recipe.category} ${recipe.ingredients.join(' ')}`.toLowerCase().includes(q);
      const matchesCategory = category === 'all' || recipe.category === category;
      const matchesProtein = !proteinOnly || recipe.proteinTier === 'high' || recipe.tags.includes('high-protein');
      const matchesVegetarian = !vegetarianOnly || recipe.isVegetarian;
      const pantryHits = pantry.filter((item) => recipe.ingredients.join(' ').toLowerCase().includes(item.toLowerCase())).length;
      const matchesPantry = !pantry.length || (pantryMode === 'all' ? pantryHits === pantry.length : pantryHits > 0);
      return matchesQuery && matchesCategory && matchesProtein && matchesVegetarian && matchesPantry;
    });
    return result.sort((a, b) => sort === 'protein' ? b.nutrition.protein - a.nutrition.protein : sort === 'calories' ? a.nutrition.calories - b.nutrition.calories : sort === 'time' ? a.totalMinutes - b.totalMinutes : sort === 'alpha' ? a.title.localeCompare(b.title) : sort === 'favorites' ? Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)) : b.nutrition.protein - a.nutrition.protein);
  }, [category, favorites, pantry, pantryMode, proteinOnly, query, sort, vegetarianOnly, visibleRecipes]);

  function toggleFavorite(id: number) { setFavorites((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]); }
  function togglePantry(item: string) { setPantry((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]); }

  return <main className="site-shell">
    <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">HPC</span><span>Rice Cooker<br /><strong>&amp; Protein Kitchen</strong></span></Link><nav><Link href="/rice-cooker-guide">Rice cooker guide</Link><a href="#recipes">Browse recipes</a></nav></header>
    <section className="hero"><div><p className="eyebrow">{recipes.length} recipes · {recipes.filter((recipe) => recipe.visibility === 'core').length} core recipes · local-first kitchen</p><h1>Cook more with less<br /><em>guesswork.</em></h1><p className="hero-copy">A candid recipe library for rice cookers, ovens, and skillets—covering everyday breads, sides, breakfasts, and protein-forward meals with honest testing status.</p></div><div className="hero-card"><span className="hero-card-label">Today’s shortcut</span><strong>{recipes.filter((r) => r.riceCooker).length} rice-cooker recipes</strong><span>Use the guide before your first batch.</span><Link href="/rice-cooker-guide">Learn the method →</Link></div></section>
    <section className="controls" aria-label="Recipe filters"><div className="search-wrap"><label htmlFor="recipe-search">Search recipes</label><input id="recipe-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try chicken, oats, lemon…" /></div><button className="filter-toggle" onClick={() => setShowPantry((v) => !v)} aria-expanded={showPantry}>Pantry {pantry.length ? `(${pantry.length})` : ''}</button><label className="select-label">Sort<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recommended">Recommended</option><option value="protein">Highest protein</option><option value="calories">Lowest calories</option><option value="time">Fastest</option><option value="favorites">Favorites first</option><option value="alpha">A–Z</option></select></label><label className="check-label"><input type="checkbox" checked={proteinOnly} onChange={(e) => setProteinOnly(e.target.checked)} /> Protein+</label><label className="check-label"><input type="checkbox" checked={vegetarianOnly} onChange={(e) => setVegetarianOnly(e.target.checked)} /> Vegetarian</label><label className="check-label"><input type="checkbox" checked={includeVariations} onChange={(e) => setIncludeVariations(e.target.checked)} /> Include variations</label></section>
    <div className={`library-layout ${showPantry ? 'pantry-open' : ''}`}><aside className="sidebar" aria-label="Categories and pantry"><div className="sidebar-heading"><span>Browse</span><button className="close-mobile" onClick={() => setShowPantry(false)} aria-label="Close pantry filters">×</button></div><button className={category === 'all' ? 'category active' : 'category'} onClick={() => setCategory('all')}><span>{includeVariations ? 'All recipes' : 'Core recipes'}</span><b>{visibleRecipes.length}</b></button>{categoryOrder.map((key) => <button key={key} className={category === key ? 'category active' : 'category'} onClick={() => setCategory(key)}><span>{categoryLabels[key]}</span><b>{visibleRecipes.filter((recipe) => recipe.category === key).length}</b></button>)}<div className="sidebar-section"><div className="sidebar-heading"><span>Pantry match</span><span className="muted">{pantry.length} selected</span></div><div className="mode-switch"><button className={pantryMode === 'all' ? 'active' : ''} onClick={() => setPantryMode('all')}>All</button><button className={pantryMode === 'any' ? 'active' : ''} onClick={() => setPantryMode('any')}>Any</button></div>{pantryOptions.map((item) => <label className="pantry-item" key={item}><input type="checkbox" checked={pantry.includes(item)} onChange={() => togglePantry(item)} />{item}</label>)}</div></aside><section className="results" id="recipes"><div className="results-heading"><div><p className="eyebrow">{includeVariations ? 'Full library' : 'Core library'}</p><h2>{filtered.length} recipes</h2></div><span className="status-key"><i className="dot adapted" /> adapted <i className="dot concept" /> needs a cook test</span></div><div className="recipe-grid">{filtered.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} favorite={favorites.includes(recipe.id)} onFavorite={() => toggleFavorite(recipe.id)} />)}</div>{!filtered.length && <div className="empty"><h3>Nothing matched those filters.</h3><p>Try removing a pantry item or searching a broader ingredient.</p></div>}</section></div>
  </main>;
}

function RecipeCard({ recipe, favorite, onFavorite }: { recipe: Recipe; favorite: boolean; onFavorite: () => void }) {
  return <article className="recipe-card"><div className="card-top"><span className="recipe-category">{categoryLabels[recipe.category]}</span><button className="favorite" onClick={onFavorite} aria-label={`${favorite ? 'Remove' : 'Add'} ${recipe.title} ${favorite ? 'from' : 'to'} favorites`} aria-pressed={favorite}>{favorite ? '♥' : '♡'}</button></div><Link href={`/recipes/${recipe.slug}`} className="card-link"><h3>{recipe.title}</h3><p>{recipe.description}{recipe.visibility === 'variation' && recipe.collectionLabel ? ` Variation in ${recipe.collectionLabel.toLowerCase()}.` : recipe.visibility === 'technique' ? ' A flexible base rather than a standalone meal.' : ''}</p><div className="metric-row"><span><strong>{recipe.nutrition.protein}g</strong> est. protein</span><span><strong>{recipe.nutrition.calories}</strong> est. cal</span><span><strong>{recipe.totalMinutes}m</strong> total</span></div><div className="card-footer"><span>{recipe.yield.amount} {recipe.yield.label}</span><span className={`recipe-status ${recipe.status}`}>{recipe.visibility === 'variation' ? 'Variation' : recipe.visibility === 'technique' ? 'Technique' : recipe.status === 'concept' ? 'Concept testing' : 'Adapted'}</span></div></Link></article>;
}
