export type LibraryVisibility = 'core' | 'variation' | 'technique';

export type LibraryCuration = {
  visibility: LibraryVisibility;
  parentId?: number;
  collectionLabel?: string;
  displayTitle?: string;
};

const titleOverrides: Record<number, string> = {
  211: 'Lemon Yogurt Crunch Cup',
  213: 'Chilled Chocolate Yogurt Cream',
  240: 'Protein Marinade Matrix',
};

const variations: Record<number, { parentId: number; collectionLabel: string }> = {
  302: { parentId: 301, collectionLabel: 'Yeast loaf variations' },
  303: { parentId: 301, collectionLabel: 'Yeast loaf variations' },
  304: { parentId: 301, collectionLabel: 'Yeast loaf variations' },
  305: { parentId: 301, collectionLabel: 'Yeast loaf variations' },
  306: { parentId: 301, collectionLabel: 'Yeast loaf variations' },
  307: { parentId: 301, collectionLabel: 'Yeast loaf variations' },
  308: { parentId: 301, collectionLabel: 'Yeast loaf variations' },
  310: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  311: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  312: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  313: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  314: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  315: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  316: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  317: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  318: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  319: { parentId: 309, collectionLabel: 'Quick-bread variations' },
  321: { parentId: 320, collectionLabel: 'Steamed-bun variations' },
  322: { parentId: 320, collectionLabel: 'Steamed-bun variations' },
  211: { parentId: 203, collectionLabel: 'Yogurt dessert variations' },
  217: { parentId: 203, collectionLabel: 'Yogurt dessert variations' },
  220: { parentId: 203, collectionLabel: 'Yogurt dessert variations' },
  224: { parentId: 203, collectionLabel: 'Yogurt dessert variations' },
  229: { parentId: 203, collectionLabel: 'Yogurt dessert variations' },
  231: { parentId: 203, collectionLabel: 'Yogurt dessert variations' },
  233: { parentId: 203, collectionLabel: 'Yogurt dessert variations' },
  227: { parentId: 215, collectionLabel: 'Frozen bark variations' },
  214: { parentId: 212, collectionLabel: 'Cold dip variations' },
  225: { parentId: 212, collectionLabel: 'Cold dip variations' },
  234: { parentId: 212, collectionLabel: 'Cold dip variations' },
  236: { parentId: 212, collectionLabel: 'Cold dip variations' },
};

export function getLibraryCuration(raw: { id: number }): LibraryCuration {
  if (raw.id === 240) return { visibility: 'technique', collectionLabel: 'Techniques & bases', displayTitle: titleOverrides[raw.id] };
  const variation = variations[raw.id];
  if (variation) return { visibility: 'variation', ...variation, displayTitle: titleOverrides[raw.id] };
  return { visibility: 'core', displayTitle: titleOverrides[raw.id] };
}
