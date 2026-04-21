// Single global namespace — replaces all window.X assignments
export const App = {
  recipes: [],
  masterRecipes: [],
  customRecipes: [],
  favorites: new Set(),
  activeRecipe: null,
  currentServings: 4,
  selectedCookbook: 'all',
  selectedPantry: [],
  selectedTags: [],
  showProteinPlusOnly: false,
};

export const pantryData = {
  'Proteins': ['Cooked Chicken','Cooked Beef','Cooked Turkey','Egg Whites','Tofu','Lentils','Bacon'],
  'Dairy':    ['Greek Yogurt','Cottage Cheese','Cheddar','Mozzarella','Feta','Milk','Butter'],
  'Grains':   ['Rice','Oats','Bread Flour','All-Purpose Flour','Whole Wheat Flour','Quinoa'],
  'Systems':  ['Whey Protein','Casein','Gochujang','Harissa','Marinara','Honey','Cocoa','Yeast'],
};
