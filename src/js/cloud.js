import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db, appId, currentUser as _cu } from './firebase.js';
import { App } from './state.js';
import { renderRecipes, renderPantry, updateGlobalCount, hideLoadingBar } from './ui.js';

// currentUser reference (set after auth)
let cu = null;
export function setCurrentUser(user) { cu = user; }

// ── Realtime listeners ─────────────────────────────────────────────
export function setupRealtimeListeners() {
  if (!cu) return;

  // Settings (pantry, dark mode, proMode)
  const settingsRef = doc(db, 'artifacts', appId, 'users', cu.uid, 'settings', 'preferences');
  onSnapshot(settingsRef, snap => {
    if (snap.exists()) {
      const d = snap.data();
      App.selectedPantry      = d.pantry || [];
      App.showProteinPlusOnly = !!d.proMode;
      if (d.dark) document.documentElement.classList.add('dark');
      else         document.documentElement.classList.remove('dark');
      const btn = document.getElementById('pro-btn');
      if (btn) { btn.classList.toggle('bg-amber-600', App.showProteinPlusOnly); btn.classList.toggle('bg-stone-800', !App.showProteinPlusOnly); }
      renderPantry();
      renderRecipes();
    }
    hideLoadingBar();
  }, e => { console.error('Settings sync error:', e); hideLoadingBar(); });

  // Custom recipes
  const recipesRef = collection(db, 'artifacts', appId, 'users', cu.uid, 'customRecipes');
  onSnapshot(recipesRef, snap => {
    App.customRecipes = [];
    snap.forEach(d => App.customRecipes.push(d.data()));
    App.recipes = [...App.masterRecipes, ...App.customRecipes];
    updateGlobalCount();
    renderRecipes();
  }, e => console.error('Recipes sync error:', e));

  // Favorites
  const favsRef = collection(db, 'artifacts', appId, 'users', cu.uid, 'favorites');
  onSnapshot(favsRef, snap => {
    App.favorites = new Set();
    snap.forEach(d => App.favorites.add(d.data().id));
    renderRecipes();
  }, e => console.error('Favorites sync error:', e));
}

// ── Save settings ──────────────────────────────────────────────────
export function saveSettingsToCloud() {
  if (!cu) return;
  const dark = document.documentElement.classList.contains('dark');
  setDoc(doc(db, 'artifacts', appId, 'users', cu.uid, 'settings', 'preferences'), {
    pantry: App.selectedPantry,
    proMode: App.showProteinPlusOnly,
    dark,
  }).catch(e => console.error('Error saving settings:', e));
}

// ── Save custom recipe ─────────────────────────────────────────────
export function saveCustomRecipe(event) {
  event.preventDefault();
  if (!cu) { alert('Database not connected. Check Firebase configuration.'); return; }

  const isPlus = document.getElementById('newProteinPlus').checked;
  let rawTitle  = document.getElementById('newTitle').value;
  if (isPlus && !rawTitle.includes('⚡')) rawTitle = '⚡ ' + rawTitle;

  const newRecipe = {
    id:            Date.now(),
    isCustom:      true,          // Fix #4: explicit flag
    title:         rawTitle,
    cat:           document.getElementById('newCat').value,
    baseS:         parseInt(document.getElementById('newServings').value) || 1,
    satiety:       parseInt(document.getElementById('newSatiety').value) || 3,
    texture:       document.getElementById('newTexture').value || 'Standard',
    isProteinPlus: isPlus,
    ingredients:   document.getElementById('newIngredients').value.split('\n').map(s=>s.trim()).filter(Boolean),
    instructions:  document.getElementById('newInstructions').value.split('\n').map(s=>s.trim()).filter(Boolean),
    // Optional macros
    calories: parseInt(document.getElementById('newCalories')?.value) || null,
    protein:  parseInt(document.getElementById('newProtein')?.value)  || null,
    carbs:    parseInt(document.getElementById('newCarbs')?.value)    || null,
    fat:      parseInt(document.getElementById('newFat')?.value)      || null,
    tags: document.getElementById('newCustomTags')
      ? [...document.getElementById('newCustomTags').querySelectorAll('input:checked')].map(el => el.value)
      : [],
  };

  setDoc(doc(db, 'artifacts', appId, 'users', cu.uid, 'customRecipes', newRecipe.id.toString()), newRecipe)
    .then(() => { import('./ui.js').then(ui => { ui.closeAddRecipeModal(); ui.selectCookbook('all'); }); })
    .catch(e => console.error('Error saving recipe:', e));
}

// ── Delete custom recipe ───────────────────────────────────────────
export function deleteCustomRecipe() {
  if (!cu || !App.activeRecipe?.isCustom) return;
  if (confirm(`Delete "${App.activeRecipe.title}" from your cloud library?`)) {
    deleteDoc(doc(db, 'artifacts', appId, 'users', cu.uid, 'customRecipes', App.activeRecipe.id.toString()))
      .then(() => import('./ui.js').then(ui => ui.closeModal()))
      .catch(e => console.error('Error deleting recipe:', e));
  }
}

// ── Favorites ──────────────────────────────────────────────────────
export function syncFavoriteToCloud(id, isFav) {
  if (!cu) return;
  const ref = doc(db, 'artifacts', appId, 'users', cu.uid, 'favorites', id.toString());
  if (isFav) setDoc(ref, { id }).catch(e => console.error('Error saving fav:', e));
  else        deleteDoc(ref).catch(e => console.error('Error removing fav:', e));
}
