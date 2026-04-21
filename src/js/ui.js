import { App, pantryData } from './state.js';

// ── Helpers ────────────────────────────────────────────────────────
export function scaleIngredient(ing, current, base) {
  const factor = current / base;
  return ing.replace(/^([\d\/\.]+)/, (match) => {
    let num = match.includes('/')
      ? parseFloat(match.split('/')[0]) / parseFloat(match.split('/')[1])
      : parseFloat(match);
    const scaled = num * factor;
    return scaled % 1 === 0 ? scaled : scaled.toFixed(2);
  });
}

// ── Loading bar ────────────────────────────────────────────────────
export function hideLoadingBar() {
  const bar = document.getElementById('loading-bar');
  if (bar) bar.classList.add('done');
}

// ── Global count ───────────────────────────────────────────────────
export function updateGlobalCount() {
  const el = document.getElementById('global-count');
  if (el) el.textContent = App.recipes.length;
}

// ── Sidebar per-category counts ────────────────────────────────────
export function renderSidebarCounts() {
  const cats = { all:0, 'High-Protein':0, 'RC-Breakfast':0, 'Rice-Cooker':0, 'RC-Breads':0, Bread:0, favorites:0 };
  App.recipes.forEach(r => { if (cats[r.cat] !== undefined) cats[r.cat]++; });
  cats.all = App.recipes.length;
  cats.favorites = App.favorites.size;
  Object.entries(cats).forEach(([key, count]) => {
    const el = document.getElementById(`count-${key.replace(/[^a-zA-Z]/g, '').toLowerCase()}`);
    if (el) el.textContent = count;
  });
}

// ── Pantry ─────────────────────────────────────────────────────────
export function renderPantry() {
  const container = document.getElementById('ingredient-checkboxes');
  if (!container) return;
  container.innerHTML = Object.entries(pantryData).map(([gn, items]) => `
    <div class="flex-grow min-w-[140px]">
      <h4 class="text-[10px] font-bold uppercase mb-2 border-b pb-1 tracking-widest" style="color:var(--text-muted);border-color:var(--border)">${gn}</h4>
      <div class="flex flex-wrap gap-2">
        ${items.map(i => `
          <div>
            <input type="checkbox" id="ch-${i.replace(/\s/g,'')}" value="${i}" class="checkbox-pill hidden"
              ${App.selectedPantry.includes(i) ? 'checked' : ''}
              onchange="window.App.togglePantryItem('${i}')">
            <label for="ch-${i.replace(/\s/g,'')}" class="px-3 py-1.5 border rounded-full text-[10px] font-semibold cursor-pointer transition hover:border-amber-400 block"
              style="background:var(--bg-card);color:var(--text-secondary);border-color:var(--border)">${i}</label>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ── Tag filter bar ─────────────────────────────────────────────────
const TAG_LABELS = {
  'high-protein': '⚡ High-Protein',
  'rice-cooker':  '🍲 Rice Cooker',
  'oven':         '🔥 Oven',
  'filling':      '💪 Filling',
  'freezer':      '❄️ Freezer',
  'no-cook':      '🥣 No-Cook',
  'breakfast':    '🌅 Breakfast',
};

export function renderTagFilter() {
  const bar = document.getElementById('tag-filter-bar');
  if (!bar) return;
  const pool = App.selectedCookbook === 'all'
    ? App.recipes
    : App.recipes.filter(r => r.cat === App.selectedCookbook);
  const tagSet = new Set(pool.flatMap(r => r.tags || []));
  if (tagSet.size === 0) { bar.innerHTML = ''; return; }
  bar.innerHTML = [...tagSet].map(tag => `
    <button class="tag-pill ${App.selectedTags.includes(tag) ? 'active' : ''}" onclick="window.App.toggleTag('${tag}')">
      ${TAG_LABELS[tag] || tag}
    </button>
  `).join('');
}

// ── Recipe grid ────────────────────────────────────────────────────
export function renderRecipes() {
  const search = (document.getElementById('searchBar')?.value || '').toLowerCase();
  const grid   = document.getElementById('recipe-grid');
  if (!grid) return;

  const filtered = App.recipes.filter(r => {
    const matchBook  = App.selectedCookbook === 'all' || App.selectedCookbook === 'favorites'
      ? (App.selectedCookbook === 'favorites' ? App.favorites.has(r.id) : true)
      : r.cat === App.selectedCookbook;
    const matchPlus  = !App.showProteinPlusOnly || r.isProteinPlus;
    const rStr       = (r.title + ' ' + (r.ingredients || []).join(' ')).toLowerCase();
    const matchSearch = rStr.includes(search);
    const matchPantry = App.selectedPantry.length === 0 ||
      App.selectedPantry.every(p => rStr.includes(p.toLowerCase()));
    const matchTags  = App.selectedTags.length === 0 ||
      App.selectedTags.some(tag => (r.tags || []).includes(tag));
    return matchBook && matchPlus && matchSearch && matchPantry && matchTags;
  });

  const noRes = document.getElementById('no-results');
  if (filtered.length === 0) {
    grid.innerHTML = '';
    noRes?.classList.remove('hidden');
  } else {
    noRes?.classList.add('hidden');
    grid.innerHTML = filtered.map(r => {
      const isFav = App.favorites.has(r.id);
      const macroBar = r.calories
        ? `<div class="text-[10px] mt-2" style="color:var(--text-muted)">🔥${r.calories}cal · 💪${r.protein}g</div>`
        : '';
      return `
        <div class="recipe-card group" onclick="window.App.openModal(${r.id})">
          <div class="flex justify-between items-start mb-2">
            <span class="text-[9px] px-2 py-0.5 rounded uppercase font-bold" style="background:var(--bg-section);color:var(--text-muted)">${r.cat.replace('-',' ')}</span>
            <div class="flex items-center gap-2">
              ${r.isProteinPlus ? '<span class="text-amber-500 font-bold text-[10px]">⚡ PRO+</span>' : ''}
              <button class="fav-btn ${isFav ? 'active' : ''} no-print" onclick="event.stopPropagation();window.App.toggleFavorite(${r.id})">${isFav ? '♥' : '♡'}</button>
            </div>
          </div>
          <h4 class="font-bold text-sm mb-1 group-hover:text-amber-600 leading-tight transition-colors">${r.title.replace('⚡ ','')}</h4>
          ${macroBar}
          <div class="mt-auto pt-3 border-t flex justify-between items-center text-[10px]" style="border-color:var(--border);color:var(--text-muted)">
            <span class="font-medium">${r.texture || 'Standard'}</span>
            <span>${'●'.repeat(r.satiety||3)}${'○'.repeat(5-(r.satiety||3))}</span>
          </div>
        </div>`;
    }).join('');
  }
  renderSidebarCounts();
  renderTagFilter();
}

// ── Modal ──────────────────────────────────────────────────────────
export function openModal(id) {
  App.activeRecipe = App.recipes.find(x => x.id === id);
  if (!App.activeRecipe) return;
  App.currentServings = App.activeRecipe.baseS || 4;
  updateModalUI();
  const delBtn = document.getElementById('deleteRecipeBtn');
  delBtn?.classList.toggle('hidden', !App.activeRecipe.isCustom);
  document.getElementById('recipeModal').classList.add('is-open');
}

export function closeModal() {
  document.getElementById('recipeModal').classList.remove('is-open');
}

export function updateModalUI() {
  const r = App.activeRecipe;
  if (!r) return;
  document.getElementById('mTitle').textContent    = r.title.replace('⚡ ', '');
  document.getElementById('mTag').textContent      = r.cat.replace('-', ' ');
  document.getElementById('mTexture').textContent  = r.texture || 'Standard';
  document.getElementById('mSatiety').style.width  = ((r.satiety || 3) * 20) + '%';
  document.getElementById('mServings').textContent = App.currentServings;

  // Macros (optional)
  const macroEl = document.getElementById('mMacros');
  if (macroEl) {
    if (r.calories) {
      macroEl.innerHTML = `<span>🔥 ${r.calories} cal</span><span>💪 ${r.protein||0}g protein</span><span>🌾 ${r.carbs||0}g carbs</span><span>💧 ${r.fat||0}g fat</span>`;
      macroEl.classList.remove('hidden');
    } else {
      macroEl.classList.add('hidden');
    }
  }

  const scaled = (r.ingredients || []).map(ing => scaleIngredient(ing, App.currentServings, r.baseS));
  document.getElementById('mIngredients').innerHTML = scaled.map(i => `
    <li class="flex items-start gap-2 border-b pb-1" style="border-color:var(--border)">
      <span style="color:var(--accent)">•</span><span>${i}</span>
    </li>`).join('');
  document.getElementById('mInstructions').innerHTML = (r.instructions || []).map(i => `<li>${i}</li>`).join('');
  const pEl = document.getElementById('mProteinRec');
  if (pEl) { pEl.textContent = r.proteinRec || ''; pEl.classList.toggle('hidden', !r.proteinRec); }
}

export function adjustServings(delta) {
  const n = App.currentServings + delta;
  if (n >= 1 && n <= 24) { App.currentServings = n; updateModalUI(); }
}

// ── Add Recipe Modal ───────────────────────────────────────────────
export function openAddRecipeModal() {
  document.getElementById('addRecipeModal').classList.add('is-open');
  toggleMenu();
}
export function closeAddRecipeModal() {
  document.getElementById('addRecipeModal').classList.remove('is-open');
  document.getElementById('addRecipeForm').reset();
}

// ── Navigation ─────────────────────────────────────────────────────
export function toggleMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('nav-overlay');
  const isOpen  = !sidebar.classList.contains('-translate-x-full');

  if (isOpen) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    overlay.addEventListener('transitionend', () => overlay.classList.add('hidden'), { once: true });
  } else {
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
    });
    sidebar.classList.remove('-translate-x-full');
  }
}

export function switchPage(p) {
  document.querySelectorAll('.page-content').forEach(x => x.classList.add('hidden'));
  document.getElementById(`page-${p}`)?.classList.remove('hidden');
  renderRecipes();
}

export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export function selectCookbook(id) {
  App.selectedCookbook = id;
  App.selectedTags = [];
  switchPage('home');
  const titles = { all:'All Recipes','RC-Breads':'Rice Cooker Breads','RC-Breakfast':'RC Breakfast','Rice-Cooker':'RC Mains','High-Protein':'Protein System', Bread:'Oven Breads', favorites:'❤️ Favorites' };
  const el = document.getElementById('active-book-title');
  if (el) el.textContent = titles[id] || id.replace('-', ' ');
  toggleMenu();
}

export function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('virtualLibraryDark', String(document.documentElement.classList.contains('dark')));
}

export function filterProteinPlus() {
  App.showProteinPlusOnly = !App.showProteinPlusOnly;
  const btn = document.getElementById('pro-btn');
  btn?.classList.toggle('bg-amber-600', App.showProteinPlusOnly);
  btn?.classList.toggle('bg-stone-800', !App.showProteinPlusOnly);
  renderRecipes();
}

export function toggleTag(tag) {
  const idx = App.selectedTags.indexOf(tag);
  if (idx > -1) App.selectedTags.splice(idx, 1);
  else App.selectedTags.push(tag);
  renderRecipes();
}

export function toggleFavorite(id) {
  if (App.favorites.has(id)) App.favorites.delete(id);
  else                        App.favorites.add(id);
  localStorage.setItem('virtualLibraryFavorites', JSON.stringify([...App.favorites]));
  renderRecipes();
}

export function togglePantryItem(item) {
  if (App.selectedPantry.includes(item)) App.selectedPantry = App.selectedPantry.filter(x => x !== item);
  else App.selectedPantry.push(item);
  // Fix #2: persist to both localStorage AND cloud
  localStorage.setItem('virtualLibraryPantry', JSON.stringify(App.selectedPantry));
  renderRecipes();
}

export function clearAllFilters() {
  App.selectedPantry      = [];
  App.showProteinPlusOnly = false;
  App.selectedTags        = [];
  localStorage.setItem('virtualLibraryPantry', JSON.stringify([]));
  localStorage.setItem('virtualLibraryPro', 'false');
  const s = document.getElementById('searchBar');
  if (s) s.value = '';
  const btn = document.getElementById('pro-btn');
  if (btn) { btn.classList.remove('bg-amber-600'); btn.classList.add('bg-stone-800'); }
  renderPantry();
  renderRecipes();
}
