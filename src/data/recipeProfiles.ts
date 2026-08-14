export type RecipeTaste = 'sweet' | 'savory';

// Dessert is intentionally narrower than sweet: yogurt bowls, baked treats,
// puddings, frozen treats, and candy-like snacks belong here; sweet oats and
// breakfast breads remain Sweet without being labeled Dessert.
const dessertIds = new Set([
  203, 204, 206, 207, 211, 213, 215, 216, 217, 220, 224, 227, 231, 232, 233, 235,
]);

const sweetIds = new Set([
  13, 23, 26, 27, 102, 103, 104, 105, 208, 229, 237, 238, 309, 310, 311, 312, 313, 314, 315, 322,
]);

export function getRecipeProfile(raw: { id: number; title: string }) {
  const title = raw.title.replace(/^⚡\s*/, '').toLowerCase();
  const isDessert = dessertIds.has(raw.id) || /cheesecake|ice cream|mug cake|pudding|protein bark|chocolate shell|cookie dough|parfait|carrot cake|salted caramel/.test(title);
  const isSweet = isDessert || sweetIds.has(raw.id) || /banana|pumpkin spice|cinnamon roll|panettone|brioche|quick bread|lemon poppy|blueberry yogurt|apple cinnamon|chocolate chip|vanilla steamed/.test(title);
  return { taste: (isSweet ? 'sweet' : 'savory') as RecipeTaste, isDessert };
}
