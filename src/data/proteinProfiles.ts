export type ProteinType = 'chicken' | 'turkey' | 'beef' | 'pork' | 'seafood' | 'eggs-dairy' | 'plant-based' | 'none';

export const proteinTypeLabels: Record<ProteinType, string> = {
  chicken: 'Chicken',
  turkey: 'Turkey',
  beef: 'Beef',
  pork: 'Pork',
  seafood: 'Seafood',
  'eggs-dairy': 'Eggs & dairy',
  'plant-based': 'Plant-based',
  none: 'No listed protein',
};

export function getProteinType(raw: { title: string; ingredients: string[] }): ProteinType {
  const text = `${raw.title} ${raw.ingredients.join(' ')}`.replace(/^⚡\s*/, '').toLowerCase();
  if (/salmon|shrimp|fish|tuna|anchov|seafood/.test(text)) return 'seafood';
  if (/turkey/.test(text)) return 'turkey';
  if (/chicken|poultry/.test(text)) return 'chicken';
  if (/beef|steak|hamburger|burger/.test(text)) return 'beef';
  if (/pork|bacon|ham|sausage/.test(text)) return 'pork';
  if (/egg|whey|collagen|greek yogurt|cottage cheese|cheddar|feta|mozzarella|parmesan|milk|yogurt|cheese|cream|paneer|casein/.test(text)) return 'eggs-dairy';
  if (/tofu|tempeh|edamame|lentil|bean|chickpea|pea protein|seitan|quinoa|nut|almond|peanut|tahini|seed|oat|coconut/.test(text)) return 'plant-based';
  return 'none';
}
