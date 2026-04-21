import './css/style.css';
import { App } from './js/state.js';
import { getMasterRecipes } from './data/recipes.js';
import {
  renderRecipes, renderPantry, updateGlobalCount,
  openModal, closeModal, adjustServings,
  toggleMenu, switchPage, scrollToSection, selectCookbook,
  toggleDarkMode, filterProteinPlus, toggleTag, toggleFavorite,
  togglePantryItem, clearAllFilters, hideLoadingBar,
} from './js/ui.js';

// ── Bootstrap data ──────────────────────────────────────────────────
App.masterRecipes = getMasterRecipes();
App.recipes       = [...App.masterRecipes];

// ── Restore localStorage state ──────────────────────────────────────
const savedPantry = localStorage.getItem('virtualLibraryPantry');
if (savedPantry) App.selectedPantry = JSON.parse(savedPantry);

const savedFavs = localStorage.getItem('virtualLibraryFavorites');
if (savedFavs) App.favorites = new Set(JSON.parse(savedFavs));

if (localStorage.getItem('virtualLibraryDark') === 'true') document.documentElement.classList.add('dark');

if (localStorage.getItem('virtualLibraryPro') === 'true') {
  App.showProteinPlusOnly = true;
  document.getElementById('pro-btn')?.classList.replace('bg-stone-800', 'bg-amber-600');
}

// ── Expose on window.App for HTML onclick handlers ──────────────────
window.App = {
  get recipes()        { return App.recipes; },
  get selectedPantry() { return App.selectedPantry; },
  openModal, closeModal, adjustServings,
  toggleMenu, switchPage, scrollToSection, selectCookbook,
  toggleDarkMode, filterProteinPlus, toggleTag, toggleFavorite,
  togglePantryItem, clearAllFilters,
  renderRecipes,
};

// ── Initial render ──────────────────────────────────────────────────
renderPantry();
renderRecipes();
updateGlobalCount();
hideLoadingBar();
