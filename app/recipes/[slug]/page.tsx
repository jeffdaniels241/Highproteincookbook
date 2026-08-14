import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categoryLabels, findRecipe, recipes } from '../../../src/data/recipes';

export function generateStaticParams() { return recipes.map((recipe) => ({ slug: recipe.slug })); }

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = findRecipe(slug);
  if (!recipe) notFound();
  const libraryNote = recipe.visibility === 'variation' && recipe.collectionLabel ? `Variation in ${recipe.collectionLabel.toLowerCase()}.` : recipe.visibility === 'technique' ? 'A flexible technique or base rather than a standalone meal.' : 'Core library recipe.';
  const generalSafety = recipe.title.toLowerCase().match(/chicken|turkey|poultry/) ? 'Cook poultry and leftovers to 165°F.' : recipe.title.toLowerCase().match(/beef|pork|lamb/) ? 'Cook ground meat to 160°F and whole cuts to 145°F with rest.' : recipe.title.toLowerCase().match(/egg|breakfast/) ? 'Cook egg dishes to 160°F.' : recipe.title.toLowerCase().match(/shrimp|fish/) ? 'Cook seafood to 145°F.' : 'Keep dairy-based recipes chilled and refrigerate leftovers within 2 hours.';
  return <main className="site-shell detail-shell">
    <header className="topbar"><Link className="brand" href="/"><span className="brand-mark">HPC</span><span>Rice Cooker<br /><strong>&amp; Protein Kitchen</strong></span></Link><Link href="/" className="back-link">← Back to all recipes</Link></header>
    <article className="recipe-detail">
      <div className="detail-kicker"><span>{categoryLabels[recipe.category]}</span><span className={`recipe-status ${recipe.status}`}>{recipe.status === 'concept' ? 'Concept testing required' : 'Adapted — not physically tested'}</span></div>
      <h1>{recipe.title}</h1><p className="detail-intro">{recipe.description}</p>
      <p className="pairing-note"><strong>Library placement:</strong> {libraryNote} <strong>Protein tier:</strong> {recipe.proteinTier}. Macros are estimates.</p><div className="detail-metrics"><span><b>{recipe.nutrition.protein}g</b> protein</span><span><b>{recipe.nutrition.calories}</b> calories*</span><span><b>{recipe.totalMinutes} min</b> total</span><span><b>{recipe.yield.amount}</b> {recipe.yield.label}</span></div>
      <section className="audit-callout"><p className="eyebrow">Static review</p><p><strong>{recipe.audit.verdict === 'promising' ? 'Promising formula' : 'Needs a kitchen test'}</strong> · {recipe.audit.finding}</p><p className="muted">This is a recipe review, not a physical cook-test claim.</p></section>
      {recipe.proteinPairing && <p className="pairing-note"><strong>Suggested protein pairing:</strong> {recipe.proteinPairing}</p>}
      {recipe.riceCooker && <section className="method-callout"><p className="eyebrow">Rice-cooker method</p><h2>Set up before you press Cook</h2><div className="method-grid"><div><b>Capacity</b><span>{recipe.riceCooker.capacity}</span></div><div><b>Mode</b><span>{recipe.riceCooker.mode}</span></div><div><b>Timing</b><span>{recipe.riceCooker.timing}</span></div><div><b>Doneness</b><span>{recipe.riceCooker.doneness}</span></div></div><p className="safety-note"><strong>Safety:</strong> {recipe.riceCooker.safety}</p></section>}
      <div className="recipe-columns"><section><h2>Ingredients</h2><ul className="ingredient-list">{recipe.ingredients.map((ingredient, i) => <li key={`${ingredient}-${i}`}>{ingredient}</li>)}</ul></section><section><h2>Method</h2><ol className="instruction-list">{recipe.instructions.map((instruction, i) => <li key={`${instruction}-${i}`}><span>{i + 1}</span><p>{instruction}</p></li>)}</ol><div className="storage"><h3>Storage</h3><p>{recipe.riceCooker?.storage || 'Cool completely, refrigerate in a sealed container, and use within 3–4 days. Reheat until steaming hot.'}</p></div><div className="storage"><h3>Safety</h3><p>{recipe.riceCooker?.safety || generalSafety}</p></div></section></div>
      <p className="nutrition-note">* Nutrition is an estimate based on the listed ingredients and yield. Adjust for your brands and substitutions.</p>
    </article>
  </main>;
}
