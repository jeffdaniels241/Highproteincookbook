export type AuditVerdict = 'promising' | 'needs-revision' | 'not-rice-cooker';

export type AuditOverride = {
  verdict: AuditVerdict;
  finding: string;
  method: 'rice-cooker' | 'oven' | 'stovetop' | 'no-cook' | 'freeze' | 'blend-and-chill' | 'microwave';
  ingredients?: string[];
  instructions?: string[];
  prepMinutes?: number;
  cookMinutes?: number;
  riceCooker?: {
    capacity: string;
    mode: string;
    timing: string;
    doneness: string;
    safety: string;
    storage: string;
  };
};

const storage = 'Cool leftovers quickly, refrigerate within 2 hours in shallow containers, use within 3–4 days, and reheat to 165°F.';
const cookerCapacity = '5.5–6 cup cooker; stay below the manufacturer fill line and below half-full for foaming porridge, lentils, and soup.';

function titleOf(raw: any) { return String(raw.title).replace(/^⚡\s*/, '').toLowerCase(); }

function proteinGuidance(raw: any) {
  const pairing = String(raw.proteinRec || '').replace(/^Pair with:\s*/i, '').toLowerCase();
  if (pairing.includes('shrimp')) return 'Protein: use 1 lb peeled, deveined raw shrimp. Add during the final 5–7 minutes only and verify 145°F; do not leave shrimp on Warm for an extended period.';
  if (pairing.includes('ground turkey') || pairing.includes('turkey')) return 'Protein: use 1 lb 93% lean ground turkey, browned separately and verified at 165°F; drain, then fold in after the grain or stew is cooked.';
  if (pairing.includes('ground beef') || pairing.includes('lean beef')) return 'Protein: use 1 lb 90% lean ground beef, browned and drained separately to 160°F; fold in after the grain or stew is cooked.';
  if (pairing.includes('diced beef')) return 'Protein: use 12 oz lean beef in ½-inch cubes, browned separately to at least 145°F and rested 3 minutes; fold in after the grain is cooked.';
  if (pairing.includes('lamb')) return 'Protein: use 12 oz lamb strips, cooked separately to 145°F and rested 3 minutes; fold in after the grain or soup is cooked.';
  if (pairing.includes('pork')) return 'Protein: use 12 oz thin pork strips, cooked separately to 145°F and rested 3 minutes; fold in after the rice is cooked.';
  if (pairing.includes('chicken')) return 'Protein: use 12 oz boneless, skinless chicken that is already cooked and shredded; reheat it in the finished dish or verify 165°F if cooking it separately.';
  if (pairing.includes('pulled pork')) return 'Protein: use 12 oz fully cooked pulled pork; add after the rice cycle and reheat the mixture to 165°F.';
  if (pairing.includes('sausage')) return 'Protein: use 12 oz fully cooked chicken sausage, sliced; add after the main cycle and reheat to 165°F.';
  if (pairing.includes('bacon')) return 'Protein: use 4 slices bacon, cooked crisp and crumbled; add after the stew is finished.';
  if (pairing.includes('tofu')) return 'Protein: use one 14-oz block extra-firm tofu, pressed 15 minutes and cut into ¾-inch cubes; add with the vegetables or fold in after cooking.';
  if (pairing.includes('egg whites')) return 'Protein: the listed ½ cup liquid egg whites are raw. Add them after the grain cycle, switch back to Cook, stir continuously, and verify 160°F before serving.';
  if (pairing.includes('collagen')) return 'Protein: whisk 1 scoop collagen into the finished warm oatmeal; do not use collagen as a replacement for the grain liquid.';
  if (pairing.includes('paneer')) return 'Protein: use 8 oz paneer cubes or 4 hard-boiled eggs; add after the rice cycle so they do not break apart.';
  return 'Protein: use the listed beans or legumes in canned, cooked form unless the ingredient explicitly says dry lentils; never add dry kidney beans to a rice cooker.';
}

function riceSetup(raw: any) {
  const title = titleOf(raw);
  const ingredients = raw.ingredients.join(' ').toLowerCase();
  if (raw.id === 115) return 'Rinse 1 cup quinoa in a fine sieve. Add it first, then 1¼ cups total broth or water, following the cooker’s quinoa/white-rice line if available; do not use the old 1¾-cup amount.';
  if (ingredients.includes('steel-cut')) return 'Add rinsed steel-cut oats, liquid, and firm fruit to the pot. Use the cooker’s porridge setting and keep the batch below half-full; do not add egg whites at the start.';
  if (ingredients.includes('lentil')) return 'Rinse the named lentils and pick out debris. Add lentils, liquid, and firm vegetables first; red lentils can cook on Porridge, while brown lentils need Soup/Whole Grain and a longer check.';
  if (raw.cat === 'Rice-Cooker' && title.includes('soup')) return 'Add broth or water first, then vegetables, legumes, and seasonings. Add pasta only for the final 12–15 minutes so it does not dissolve; keep the pot below half-full.';
  if (ingredients.includes('rice')) return 'Rinse the rice until the water is mostly clear. Add rice first, then measure total liquid with the cooker’s rice line or manual; wet vegetables, beans, tomato, and coconut milk count toward the liquid load.';
  return 'Add the grain and liquid first, then firm vegetables and seasonings. Keep dairy, citrus, fresh herbs, miso, and cooked seafood out until the finishing step.';
}

function riceFinish(raw: any) {
  const title = titleOf(raw);
  if (title.includes('miso')) return 'Finish: when the grains are tender, unplug or switch to Warm, whisk miso with 2 tbsp hot cooking liquid, then stir it back in. Add ginger, herbs, and sesame oil at the end.';
  if (title.includes('shrimp')) return 'Finish: add shrimp only for the final 5–7 minutes of an active Cook/Soup cycle. Stir once, close the lid, and verify every shrimp is opaque and 145°F before serving.';
  if (title.includes('egg')) return 'Finish: add the raw egg whites after the grain is tender, switch back to Cook, and stir continuously until the mixture reaches 160°F; never rely on Warm alone.';
  if (title.includes('curry')) return 'Finish: stir in coconut milk, fish sauce, lime, and herbs after cooking. This prevents curdling and keeps the bright flavors intact.';
  if (title.includes('bibimbap')) return 'Finish: when rice is tender, add leafy greens and close the lid for 3–5 minutes. Add gochujang, sesame oil, and a separately cooked egg or meat at serving.';
  if (title.includes('biryani')) return 'Finish: rest closed for 10 minutes, then fluff gently from the bottom. Add saffron milk, fried onion, mint, and cilantro after the rest rather than stirring them through early.';
  if (raw.cat === 'Rice-Cooker' && title.includes('soup')) return 'Finish: check grain/legume tenderness and bring meat or seafood to its stated temperature. Stir in dairy, miso, citrus, and fresh herbs after switching to Warm.';
  return 'Finish: when the cooker switches to Warm, rest closed 10 minutes, then check the center. If grain is firm, add 2 tbsp hot liquid and run another 10-minute Cook interval; do not keep restarting blindly.';
}

function safetyFor(raw: any) {
  const title = titleOf(raw);
  const pairing = String(raw.proteinRec || '').toLowerCase();
  if (title.includes('shrimp') || pairing.includes('shrimp')) return 'Use a thermometer: shrimp/fish must reach 145°F. Do not use a delayed-start timer with raw seafood.';
  if (title.includes('egg') || pairing.includes('egg')) return 'Use a thermometer: egg dishes and liquid egg whites must reach 160°F.';
  if (pairing.match(/ground beef|ground turkey/)) return 'Brown ground meat separately and verify 160°F for beef or 165°F for turkey before adding it back.';
  if (pairing.match(/chicken|poultry/)) return 'Chicken and poultry must reach 165°F; use cooked poultry as directed and reheat the finished dish to 165°F.';
  return 'Use canned/cooked beans or properly rinsed lentils. Refrigerate within 2 hours and reheat leftovers to 165°F.';
}

function riceOverride(raw: any): AuditOverride {
  const title = titleOf(raw);
  const id = raw.id;
  if (id >= 301 && id <= 308) {
    const wholeWheat = id === 306;
    return {
      verdict: 'needs-revision', method: 'rice-cooker', finding: 'Yeast loaf formula is plausible, but the rice cooker cannot brown like an oven and the second cycle must be controlled to avoid a hard crust.',
      prepMinutes: 150, cookMinutes: 65,
      instructions: [
        `Mix: whisk the flour, yeast, salt, sugar, and any dry flavorings. Add warm water or milk (about 105–110°F) and oil; ${wholeWheat ? 'hold back 2 tbsp liquid, then add it only if the whole-wheat dough feels stiff.' : 'knead or fold until no dry flour remains.'}`,
        'Develop: cover and rest 20 minutes, then knead 6–8 minutes or complete four stretch-and-folds. The dough should be soft, elastic, and slightly tacky—not wet or batter-like.',
        'Proof: cover in a lightly oiled bowl until about doubled, 60–90 minutes. Shape into a tight round that fits the greased cooker pot with at least 2 inches of headroom; proof in the pot 30–45 minutes.',
        'Cook: select Cook/White Rice with the lid closed. When it switches to Warm, check the center. If it is doughy, restart one 10–15-minute interval at a time; stop when the center is 190–200°F.',
        'Finish safely: let the loaf rest 10 minutes, loosen the sides, and invert onto a rack. Flip only once and only with a plate/rack; do not handle the hot pot bare-handed. Cool at least 45 minutes before slicing.',
      ],
      riceCooker: { capacity: cookerCapacity, mode: 'Cook / White Rice; no delayed start', timing: 'First cycle usually 45–60 minutes; use 10–15-minute extensions only after checking the center.', doneness: 'Firm top and sides; center 190–200°F; no wet dough at the base.', safety: 'Keep yeast dough below the cooker’s halfway mark and never use delayed start with dairy or eggs.', storage },
    };
  }
  if (id >= 309 && id <= 319) {
    const savory = id >= 316;
    const variant = {
      309: 'base batter: use ½ cup milk and ¼ cup oil; keep sugar at ½ cup for a less-sweet loaf.',
      310: 'banana batter: use 1¼ cups mashed banana, ¼ cup milk, and ¼ cup oil; reduce sugar to ⅓ cup when the bananas are very ripe.',
      311: 'pumpkin batter: use 1 cup pumpkin puree, ¼ cup milk, and ¼ cup oil; keep sugar at ½ cup.',
      312: 'lemon batter: use ½ cup milk, ¼ cup oil, and the listed zest/juice; add the juice with the wet ingredients.',
      313: 'yogurt batter: use ½ cup thick Greek yogurt, ¼ cup milk, and ¼ cup oil; toss berries in 1 tbsp flour.',
      314: 'apple batter: use ¾ cup patted-dry apple, ½ cup milk, and ¼ cup oil; keep nuts at ¼ cup so the loaf sets.',
      315: 'chocolate-chip batter: use ½ cup milk, ¼ cup oil, and ¾ cup chips maximum.',
      316: 'savory batter: use ¾ cup milk and ¼ cup oil; fold cheese and chives in last.',
      317: 'corn-cheddar batter: use ¾ cup milk and ¼ cup oil; pat jalapeño dry before folding it in.',
      318: 'feta-olive batter: use ¾ cup milk and ¼ cup oil; drain and pat the olives dry.',
      319: 'tomato-basil batter: use ¾ cup milk and ¼ cup oil; drain oil-packed tomatoes thoroughly.',
    }[id];
    return {
      verdict: 'needs-revision', method: 'rice-cooker', finding: 'Quick-bread family needed lower free liquid, clear variant quantities, and a center-temperature check to reduce gummy middles.', prepMinutes: 20, cookMinutes: 65,
      instructions: [
        `Prep: grease and line the cooker pot if the manufacturer allows it. ${variant}`,
        'Mix: whisk flour, baking powder, salt, and spices in one bowl. Whisk eggs and the measured liquid/fat in another. Fold wet into dry just until no dry streaks remain; fold fruit, cheese, or vegetables in last.',
        'Load: scrape batter into the pot and level it. Do not fill above one-half of the pot because quick bread expands and needs steam space. Do not stir after the lid closes.',
        'Cook: use Cook/White Rice with the lid closed. When it switches to Warm, test the center with a skewer and thermometer; add 10-minute Cook intervals until the skewer has moist crumbs, not wet batter, and the center is 200–205°F.',
        'Cool: switch off, rest 10 minutes, then lift the loaf out and cool on a rack at least 45 minutes. The surface will be pale; that is normal for a rice cooker. Refrigerate once cool.',
      ],
      riceCooker: { capacity: cookerCapacity, mode: 'Cook / White Rice; do not use Quick if your model has a gentler Cake setting', timing: 'About 50–70 minutes, then 10-minute extensions as needed; model variation is expected.', doneness: 'Center 200–205°F, skewer shows moist crumbs rather than batter; no wet ring at the bottom.', safety: savory ? 'If the batter includes egg, cheese, or meat, the center must reach 160°F or the meat’s stated endpoint before serving.' : 'Egg-based batter must reach 160°F; cool promptly and refrigerate within 2 hours.', storage },
    };
  }
  if (id >= 320 && id <= 322 || id === 39) {
    return {
      verdict: 'needs-revision', method: 'rice-cooker', finding: 'Steamed bun formula is plausible when the basket has room for expansion; the essential missing pieces were water level, spacing, lid handling, and rest.', prepMinutes: 110, cookMinutes: 18,
      instructions: [
        'Mix and knead: combine flour, yeast, sugar, salt, milk/water, and oil. Knead 8–10 minutes until smooth. Cover and rise 45–60 minutes until puffy.',
        'Shape: divide into 8 equal pieces, shape smooth balls or folded ovals, and place each on a parchment square. Leave at least 1 inch between buns so they can expand.',
        'Steam setup: add 1½–2 inches of water to the cooker, place the basket above the water, and make sure the water cannot touch the buns. Bring the water to a full simmer before starting the timer.',
        'Steam: close the lid and steam 12–18 minutes. Do not lift the lid during cooking. When finished, turn off the cooker and leave the lid cracked for 2 minutes before opening fully so the buns do not collapse.',
        'Serve or store: rest 5 minutes before eating. Refrigerate cooled buns within 2 hours; re-steam 3–5 minutes to reheat.',
      ],
      riceCooker: { capacity: cookerCapacity, mode: 'Steam basket; water must remain below the basket', timing: '12–18 minutes after the water is simmering, plus a 2-minute covered rest.', doneness: 'Buns are puffed, matte, and spring back lightly; the center is no longer gummy.', safety: 'Do not let the basket run dry. Use clean hands/utensils and refrigerate leftovers within 2 hours.', storage },
    };
  }
  if (id >= 100 && id <= 106) {
    const porridge = id !== 100 && id !== 106;
    return {
      verdict: 'needs-revision', method: 'rice-cooker', finding: 'Breakfast recipes needed grain-specific liquid guidance, delayed egg/protein additions, and a real doneness endpoint.', prepMinutes: 10, cookMinutes: porridge ? 35 : 45,
      instructions: [
        `Setup: rinse the grain if applicable and add it to the pot with the firm ingredients and salt. ${riceSetup(raw)}`,
        `Liquid: use the cooker’s ${id === 103 ? 'oat or quinoa' : 'porridge/white-rice'} line for your model rather than assuming every grain uses the same ratio. Keep the batch below half-full.${id === 103 ? ' For quinoa, start around 1¼ cups liquid per cup quinoa.' : ''}`,
        'Cook: close the lid and use the named program. Do not stir during the active cycle unless your manual specifically permits it; stirring can make rice gummy and can damage a nonstick bowl.',
        riceFinish(raw),
        'Rest and check: rest 5–10 minutes. Grains must be tender and the liquid absorbed to the intended texture; if still firm, add 2 tbsp hot liquid and run one 10-minute interval.',
      ],
      riceCooker: { capacity: cookerCapacity, mode: porridge ? 'Porridge / Oatmeal; use White Rice only for rice or quinoa if the manual directs it' : 'White Rice', timing: porridge ? '30–45 minutes plus a 5–10-minute covered rest; steel-cut oats may need a second interval.' : 'One full rice cycle, then a 5–10-minute rest.', doneness: 'Grain is tender and the liquid is absorbed; egg whites, if used, reach 160°F.', safety: safetyFor(raw), storage },
    };
  }
  if (id >= 107 && id <= 117 || id >= 124 && id <= 127) {
    return {
      verdict: 'needs-revision', method: 'rice-cooker', finding: 'Grain bowl ratios were made more cooker-agnostic; wet add-ins and proteins now have an explicit order and finish stage.', prepMinutes: 15, cookMinutes: 45,
      instructions: [
        `Protein and prep: ${proteinGuidance(raw)}`,
        `Layer: ${riceSetup(raw)}`,
        'Cook: close the lid and use the stated grain cycle. Do not stir during cooking. If the cooker switches to Warm early, rest 10 minutes, then check grain texture and liquid before deciding whether to restart.',
        riceFinish(raw),
        'Serve: fluff gently, taste for salt and acid, and add fresh herbs/toppings at the table. If the center is firm, add 2 tbsp hot liquid and run one 10-minute interval rather than flooding the pot.',
      ],
      riceCooker: { capacity: cookerCapacity, mode: raw.id === 115 ? 'White Rice / Quinoa setting; follow model manual' : 'White Rice or Grain setting; use Soup only when the recipe says stew', timing: '35–55 minutes plus 10 minutes covered rest; model and grain type change the cycle.', doneness: 'Rice/quinoa is tender, legumes are soft, and no standing liquid remains unless the recipe is a soup.', safety: safetyFor(raw), storage },
    };
  }
  if (id >= 118 && id <= 123 || id === 135) {
    return {
      verdict: 'needs-revision', method: 'rice-cooker', finding: 'Legume recipes were separated from rice ratios and now distinguish red lentils, brown lentils, and canned beans.', prepMinutes: 15, cookMinutes: 55,
      instructions: [
        `Protein and prep: ${proteinGuidance(raw)}`,
        `Legume setup: ${riceSetup(raw)} Use only red or brown lentils as named; do not substitute dry kidney beans. Add salt and firm vegetables at the beginning, but hold citrus, herbs, dairy, and coconut milk until the end.`,
        'Cook: select Porridge for red lentils or Soup/Whole Grain for brown lentils. Keep the lid closed and do not stir unless the cooker manual requires it; check once the first cycle ends.',
        riceFinish(raw),
        'Doneness: red lentils should be creamy; brown lentils should be tender but still hold their shape. If firm, add ¼ cup hot broth and run 10-minute intervals. If too thin, leave on Warm uncovered only briefly and stir.',
      ],
      riceCooker: { capacity: cookerCapacity, mode: title.includes('dal') || title.includes('red lentil') ? 'Porridge / Soup' : 'Soup / Whole Grain', timing: '45–70 minutes; brown lentils may need a second cycle. Check before adding delicate ingredients.', doneness: title.includes('red lentil') || title.includes('dal') ? 'Lentils are creamy with no hard centers.' : 'Lentils are tender but intact; soup is simmered and not overflowing.', safety: safetyFor(raw), storage },
    };
  }
  if (id >= 128 && id <= 134) {
    return {
      verdict: 'needs-revision', method: 'rice-cooker', finding: id === 134 ? 'Original soup entry lacked cooking liquid and an exact beef quantity; it now has a broth-first method and separate browning step.' : 'Soup method needed pasta timing, late dairy/miso/seafood additions, and a half-fill warning.', prepMinutes: 20, cookMinutes: 45,
      ingredients: id === 134 ? [...raw.ingredients, '4c Low-Sodium Beef Broth (required)', '1lb 90% Lean Ground Beef, browned and drained separately'] : undefined,
      instructions: [
        `Protein: ${proteinGuidance(raw)}`,
        `Build: ${id === 134 ? 'Add the 4 cups broth first, then rice, beans, corn, chili powder, and salt.' : riceSetup(raw)}`,
        'Cook: use Soup/Slow Cook with the lid closed. Keep the mixture below half-full. If pasta is listed, add it only for the final 12–15 minutes and check it often.',
        'Finish: add dairy, miso, citrus, herbs, cooked meat, or seafood only at the end as directed. If raw shrimp is used, verify 145°F; if poultry is used, verify 165°F.',
        'Rest: simmer until vegetables and grains are tender, then rest 5 minutes. Thin with hot broth if needed; do not leave a thick soup on Warm for hours.',
      ],
      riceCooker: { capacity: cookerCapacity, mode: 'Soup / Slow Cook', timing: '35–60 minutes; pasta and seafood are late additions and may need only 5–15 minutes.', doneness: 'Vegetables and grains are tender; soup is hot throughout; meat/seafood reaches its listed temperature.', safety: safetyFor(raw), storage },
    };
  }
  return { verdict: 'needs-revision', method: 'rice-cooker', finding: 'Recipe retained but needs a physical cooker test before it can be called reliable.', riceCooker: { capacity: cookerCapacity, mode: 'Use the program named in the recipe', timing: 'Check at the end of the first cycle and extend in short intervals only as needed.', doneness: 'Use the recipe-specific texture and thermometer endpoint.', safety: safetyFor(raw), storage } };
}

function nonRiceOverride(raw: any): AuditOverride | undefined {
  const title = titleOf(raw);
  const breadFixes: Record<number, AuditOverride> = {
    8: { verdict: 'promising', method: 'stovetop', finding: 'Chapati is a stovetop flatbread; the correction adds salt, resting, rolling, and pan heat.', ingredients: ['2 cups whole-wheat flour', '½ tsp salt', '¾ cup warm water, plus 1–2 tbsp if needed', '1 tsp oil, optional'], instructions: ['Mix flour and salt. Add water gradually to make a soft dough; knead 5 minutes.', 'Cover and rest 30 minutes. Divide into 8 balls and roll each thin, dusting lightly with flour.', 'Heat a dry skillet over medium-high. Cook each roti 30–45 seconds until bubbles form, flip, then cook until browned spots appear; turn once more and press lightly to puff.', 'Brush lightly with ghee if desired and keep covered in a towel.'], prepMinutes: 35, cookMinutes: 15 },
    9: { verdict: 'promising', method: 'stovetop', finding: 'Tortilla method is viable after adding the correct salt, rest, thickness, and pan endpoint.', ingredients: ['2 cups all-purpose flour', '½ tsp salt', '3 tbsp neutral oil', '¾ cup warm water, added gradually'], instructions: ['Mix flour and salt. Rub in oil, then add water gradually to form a soft dough; knead 3–4 minutes.', 'Cover and rest 20 minutes. Divide into 8 balls and roll each 7–8 inches wide.', 'Cook in a hot dry skillet 30–45 seconds per side until lightly spotted but still flexible. Stack in a towel to steam-soften.'], prepMinutes: 25, cookMinutes: 10 },
    21: { verdict: 'promising', method: 'stovetop', finding: 'Paratha needed salt, a real rest, layered shaping, and a medium-heat skillet endpoint.', ingredients: ['2 cups whole-wheat flour', '¾ cup warm water, plus 1 tbsp if needed', '½ tsp salt', '2 tbsp ghee or oil'], instructions: ['Mix flour and salt. Add water gradually, knead 5 minutes, cover, and rest 30 minutes.', 'Divide into 6 balls. Roll one thin, brush with ghee, fold into a fan or coil, then roll again without pressing out every layer.', 'Cook on a medium skillet 1–2 minutes per side, brushing with ghee, until browned spots appear and the layers are cooked through.'], prepMinutes: 35, cookMinutes: 15 },
    22: { verdict: 'promising', method: 'stovetop', finding: 'Arepas need a hydrated masa rest and a two-stage cook so the center is not raw.', ingredients: ['2 cups precooked white cornmeal (masarepa)', '1 tsp salt', '1½ cups warm water, plus 1–2 tbsp if needed', '1 tbsp oil for the pan'], instructions: ['Stir water and salt together, then whisk in masarepa. Rest 5 minutes and knead until smooth.', 'Divide into 6 balls and flatten to ½-inch thick. Patch cracks with wet fingers.', 'Cook in a lightly oiled skillet over medium heat 5–7 minutes per side until a crust forms, then finish covered over low heat 8–10 minutes. The center should be firm, not pasty.'], prepMinutes: 15, cookMinutes: 22 },
    24: { verdict: 'needs-revision', method: 'oven', finding: 'Challah lacked salt and a second proof; the corrected formula makes the braid and final bake explicit.', ingredients: ['4 cups bread flour', '2 tsp salt', '¼ cup sugar', '2½ tsp instant yeast', '2 eggs', '1 cup warm water', '¼ cup neutral oil', '1 egg beaten with 1 tbsp water for wash'], instructions: ['Mix flour, salt, sugar, and yeast. Add eggs, warm water, and oil; knead 8–10 minutes until smooth.', 'Cover and rise 60–90 minutes until doubled. Divide into 3 strands, braid, and place on a lined sheet.', 'Cover and proof 30–45 minutes until puffy. Brush with egg wash.', 'Bake at 375°F for 25–30 minutes until deep golden and the center reaches 190–195°F. Cool before slicing.'], prepMinutes: 130, cookMinutes: 28 },
    25: { verdict: 'needs-revision', method: 'oven', finding: 'Milk bread lacked salt and a specified pan/proof; the correction adds both.', ingredients: ['3½ cups bread flour', '1½ tsp salt', '¼ cup sugar', '2½ tsp yeast', '1 cup warm milk', '1 egg', '¼ cup softened butter'], instructions: ['Mix flour, salt, sugar, and yeast. Add milk and egg; knead until smooth, then work in butter gradually.', 'Rise covered 60–90 minutes until doubled. Shape and place in a greased 9×5-inch loaf pan.', 'Proof 30–45 minutes until the dough crowns slightly above the pan. Bake at 350°F for 30–35 minutes until 190–195°F in the center.', 'Cool 20 minutes in the pan, then transfer to a rack.'], prepMinutes: 140, cookMinutes: 33 },
    26: { verdict: 'promising', method: 'oven', finding: 'Cinnamon rolls needed salt in the dough; the corrected method keeps the filling and frosting separate.', ingredients: ['4 cups all-purpose flour', '1½ tsp salt', '¼ cup sugar', '2½ tsp yeast', '1 cup warm milk', '2 eggs', '¼ cup softened butter', 'Filling: ¼ cup butter, ½ cup brown sugar, 2 tsp cinnamon', 'Frosting: 4 oz cream cheese, 1 cup powdered sugar, 2 tbsp milk'], instructions: ['Mix flour, salt, sugar, yeast, milk, eggs, and butter. Knead 8 minutes; rise 60–90 minutes until doubled.', 'Roll to 12×18 inches. Spread filling, roll from the long side, and cut 12 pieces.', 'Place in a greased 9×13-inch pan. Proof 30–45 minutes until puffy.', 'Bake at 350°F for 22–28 minutes until golden and the center is about 190°F. Cool 10 minutes, then frost.'], prepMinutes: 150, cookMinutes: 25 },
    27: { verdict: 'needs-revision', method: 'oven', finding: 'Panettone lacked salt and a defined deep-pan bake; the correction adds both.', ingredients: ['4 cups bread flour', '1½ tsp salt', '½ cup sugar', '2½ tsp instant yeast', '1 cup warm milk', '3 eggs plus 2 yolks', '¾ cup softened butter', '1 tsp vanilla', '1 tsp orange zest', '1 cup mixed dried fruit'], instructions: ['Mix flour, salt, sugar, yeast, milk, eggs, and yolks. Knead 10 minutes, then work in butter gradually until glossy.', 'Rise 2 hours until doubled. Fold in fruit, zest, and vanilla. Place in a paper panettone mold or deep greased pan.', 'Proof until the dough reaches just below the rim. Bake at 350°F for 45–55 minutes, tenting if dark; center should reach 190°F.', 'Cool upside down if using a tall mold so the loaf does not collapse.'], prepMinutes: 190, cookMinutes: 50 },
    28: { verdict: 'needs-revision', method: 'oven', finding: 'Whole-wheat bread lacked salt, hydration adjustment, and a pan/temperature endpoint.', ingredients: ['3 cups whole-wheat flour', '1 cup bread or all-purpose flour', '1½ tsp salt', '2 tsp instant yeast', '2 tbsp honey', '1¾ cups warm water, added gradually'], instructions: ['Mix flours, salt, and yeast. Add honey and most of the water; knead 8–10 minutes. Add the remaining water only if the dough is stiff.', 'Rise covered 60–90 minutes until puffy. Shape and place in a greased 9×5-inch pan.', 'Proof 30–45 minutes. Bake at 375°F for 35–45 minutes until the center reaches 195–200°F.', 'Cool at least 1 hour before slicing so the crumb sets.'], prepMinutes: 140, cookMinutes: 40 },
    29: { verdict: 'needs-revision', method: 'oven', finding: 'Multigrain bread lacked salt and a hydration plan for oats/seeds.', ingredients: ['2 cups bread flour', '2 cups whole-wheat flour', '1½ tsp salt', '½ cup rolled oats', '¼ cup seeds', '2 tsp instant yeast', '1¾ cups warm water, plus 1–2 tbsp if needed'], instructions: ['Mix flour, salt, yeast, oats, and seeds. Add water gradually and knead 8–10 minutes until elastic.', 'Rise 60–90 minutes until doubled. Shape into a loaf and place in a greased 9×5-inch pan.', 'Proof 30–45 minutes. Bake at 375°F for 35–45 minutes until 195–200°F in the center. Cool fully before slicing.'], prepMinutes: 150, cookMinutes: 40 },
    31: { verdict: 'needs-revision', method: 'oven', finding: 'Oatmeal bread lacked salt and a cooked-oat hydration step.', ingredients: ['2 cups bread flour', '2 cups whole-wheat flour', '1½ tsp salt', '1 cup rolled oats', '2 tsp instant yeast', '1¾ cups warm milk, added gradually'], instructions: ['Soak oats in ½ cup of the warm milk for 10 minutes. Mix with flours, salt, yeast, and remaining milk; knead until tacky and elastic.', 'Rise 60–90 minutes until doubled. Shape into a greased 9×5-inch pan and proof 30–45 minutes.', 'Bake at 375°F for 35–45 minutes until 195–200°F in the center. Cool at least 1 hour.'], prepMinutes: 150, cookMinutes: 40 },
    37: { verdict: 'needs-revision', method: 'oven', finding: 'Pizza dough lacked salt and a workable cold-fermentation/bake procedure.', ingredients: ['4 cups bread flour', '1½ tsp salt', '1 cup active sourdough starter', '1½ cups water, added gradually', '2 tbsp olive oil'], instructions: ['Mix flour, salt, starter, water, and oil until shaggy. Rest 30 minutes, then complete 3 stretch-and-folds over 90 minutes.', 'Cover and refrigerate 8–24 hours. Divide into 4 balls and warm at room temperature 60–90 minutes.', 'Stretch without a rolling pin, top lightly, and bake on a preheated stone or steel at 500°F for 8–12 minutes until blistered and cooked through.'], prepMinutes: 120, cookMinutes: 10 },
  };
  if (breadFixes[raw.id]) return breadFixes[raw.id];
  if (title === 'sweet potato protein mash') return { verdict: 'needs-revision', method: 'no-cook', finding: 'The original method never cooked the sweet potato; it now includes a microwave or oven step and a dairy-free mixing option.', prepMinutes: 5, cookMinutes: 12, instructions: ['Pierce one medium sweet potato several times. Microwave 6–10 minutes, turning halfway, until completely tender, or bake at 400°F for 45–60 minutes.', 'Split and scoop the hot flesh into a bowl. Mash until smooth, then cool 5 minutes.', 'Whisk 1 scoop whey with 2 tbsp milk or Greek yogurt to make a smooth paste; fold it into the mash with cinnamon, honey, and salt.', 'Taste and adjust with another tablespoon of milk if dry. Serve warm or chill promptly.'], ingredients: ['1 medium sweet potato (about 8 oz)', '1 scoop whey protein', '2 tbsp milk or Greek yogurt', '1 tsp cinnamon', '1 tbsp honey or maple syrup', 'Pinch of salt'] };
  if (title === 'quick protein marinades') return { verdict: 'needs-revision', method: 'no-cook', finding: 'The original entry received generic dessert instructions; it now has measured, food-safe marinade and glaze handling.', prepMinutes: 10, cookMinutes: 30, instructions: ['Choose one marinade below and whisk it in a nonreactive bowl. Reserve 2 tablespoons before adding raw protein if you want a finishing sauce.', 'For 1 lb chicken or turkey, marinate refrigerated 30 minutes to 8 hours; discard used marinade and cook poultry to 165°F.', 'For 1 lb beef or lamb, marinate 30 minutes to 12 hours; cook ground meat to 160°F or whole cuts to 145°F plus a 3-minute rest.', 'For shrimp or fish, use the citrus-free options for no more than 15–30 minutes; cook to 145°F. Brush miso/teriyaki glazes on only during the final 5–10 minutes to prevent burning.', 'Wash hands, boards, and utensils after contact with raw protein. Refrigerate the cooked food within 2 hours.'], ingredients: ['TERIYAKI for 1 lb protein: 3 tbsp soy sauce, 1 tbsp honey, 1 tsp grated ginger, 1 tsp minced garlic, 1 tsp sesame oil', 'CHIMICHURRI: ½ cup parsley, 3 tbsp olive oil, 2 tbsp red-wine vinegar, 2 garlic cloves, chili flakes', 'MISO GINGER GLAZE: 2 tbsp white miso, 1 tbsp honey, 1 tsp ginger, 1 tbsp rice vinegar, 1 tsp sesame oil', 'GARLIC HERB BUTTER: 2 tbsp melted butter, 3 garlic cloves, 1 tbsp parsley, 1 tsp lemon juice', 'SPICY HONEY: 2 tbsp honey, 1 tbsp sriracha, 1 tbsp soy sauce, ½ tsp garlic powder'] };
  if (title.includes('protein dip') || title.includes('feta dip') || title.includes('olive dip') || title.includes('yogurt crema')) return { verdict: 'needs-revision', method: 'blend-and-chill', finding: 'Cold dips should not be baked by default; the method now blends and chills, with an optional separate hot variation only when cheese is present.', prepMinutes: 10, cookMinutes: 0, instructions: ['Blend cottage cheese, Greek yogurt, lemon or vinegar, salt, and seasonings until smooth. Scrape down once; do not add water unless needed.', 'Fold in chopped olives, herbs, artichokes, or cooked shredded chicken after blending so the dip keeps some texture.', 'Taste for salt and acid, then chill 20–30 minutes. Add fresh herbs and crunchy toppings just before serving.', 'Keep refrigerated and use within 3–4 days. Do not leave dairy dips at room temperature for more than 2 hours.'] };
  if (title === 'protein egg muffins') return { verdict: 'needs-revision', method: 'oven', finding: 'Egg muffins had inherited protein-powder instructions; the correction restores a proper egg-bake method and keeps add-ins cooked.', prepMinutes: 15, cookMinutes: 22, instructions: ['Heat oven to 350°F. Grease a 12-cup muffin pan. Cook any turkey bacon or sausage fully before adding it; cool briefly.', 'Whisk 6 eggs, blended cottage cheese, salt, pepper, garlic powder, and paprika until smooth. Fold in cheese, pepper, spinach, and the cooked protein add-in.', 'Divide among cups, filling each about three-quarters full. Bake 18–25 minutes until puffed and the centers reach 160°F.', 'Rest 5 minutes before removing. Refrigerate within 2 hours and reheat leftovers to 165°F.'] };
  if (title.includes('savory sausage breakfast bake')) return { verdict: 'needs-revision', method: 'oven', finding: 'Bake method is usable but now has a thermometer endpoint and a fixed pan/yield.', instructions: ['Heat oven to 350°F and grease a 9×13-inch baking dish. Brown and drain the turkey sausage; sauté pepper and wilt spinach.', 'Whisk eggs, yogurt, seasonings, and half the cheese. Fold in the cooked sausage and vegetables.', 'Pour into the dish, top with remaining cheese, and bake 35–45 minutes until the center reaches 160°F.', 'Rest 10 minutes before cutting. Refrigerate within 2 hours; reheat portions to 165°F.'] };
  if (title.includes('mousse')) return { verdict: 'needs-revision', method: 'no-cook', finding: 'The texture did not use a whipped or aerated technique, so it is labeled as a chilled yogurt cream rather than mousse.' };
  if (title.includes('bark')) return { verdict: 'promising', method: 'freeze', finding: 'Freeze-and-break method is viable; fruit should be patted dry and the slab kept thin for a clean snap.' };
  if (title.includes('smoothie') || title.includes('shake')) return { verdict: 'promising', method: 'no-cook', finding: 'Blend method is viable; liquid-first order and immediate serving are appropriate.' };
  if (title.includes('overnight oat')) return { verdict: 'promising', method: 'no-cook', finding: 'Cold-soak method is viable; keep refrigerated and add crunchy toppings at serving.' };
  return undefined;
}

export function getAuditOverride(raw: any): AuditOverride | undefined {
  if (['RC-Breads', 'RC-Breakfast', 'Rice-Cooker'].includes(raw.cat)) return riceOverride(raw);
  return nonRiceOverride(raw);
}
