// Raw source data → mapped to full recipe objects in recipes.js
export const rcSource = [
  { t:'Savory Spinach Egg Rice',              i:['1c Rice','1.75c Broth','0.5c Egg Whites','1c Spinach','1 tbsp Soy Sauce','1 tsp Garlic'],                              m:'White Rice',  s:4, tex:'Custard-like',  plus:true,  p:'Cooked Chicken' },
  { t:'Miso Ginger Breakfast Congee',         i:['0.5c Rice','3c Broth','0.5c Egg Whites','1 tsp Ginger','1 tsp Sesame Oil','2 tbsp Miso'],                              m:'Porridge',    s:3, tex:'Smooth',        plus:true,  p:'Tofu' },
  { t:'Coconut Almond Oatmeal',               i:['1c Oats','2c Water','0.5c Coconut Milk','2 tbsp Almonds','1 tsp Maple Syrup'],                                          m:'Porridge',    s:3, tex:'Creamy',        plus:false, p:'1 scoop Collagen' },
  { t:'Blueberry Vanilla Oats',               i:['1c Oats (or 1c Quinoa for a higher-protein grain-swap variation)','2c Water','0.5c Blueberries (or mixed berries)','0.5 tsp Vanilla','1 tsp Honey','--- Oats Version: run Porridge cycle ---','--- Quinoa Berry Version: run White Rice cycle, quinoa cooks firmer and nuttier ---'],                                               m:'Porridge',    s:4, tex:'Fluffy',        plus:true,  p:'Vanilla Whey' },
  { t:'Apple Cinnamon Steel-Cut Oats',        i:['1c Steel-cut Oats','2.5c Water','0.5c Egg Whites','1 Apple','0.5 tsp Cinnamon'],                                       m:'Porridge',    s:5, tex:'Hearty',        plus:true,  p:'Egg Whites' },
  { t:'Banana Peanut Butter Porridge',        i:['1c Oats','2c Water','1 Banana','2 tbsp PB Powder','0.25 tsp Salt'],                                                    m:'Porridge',    s:4, tex:'Thick',         plus:false, p:'Turkey Bacon Bits' },
  { t:'Turmeric Breakfast Rice',              i:['1c Jasmine Rice','1.75c Broth','0.5c Egg Whites','0.5 tsp Turmeric','0.25 tsp Black Pepper','1 tsp Honey'],            m:'White Rice',  s:4, tex:'Volume-heavy',  plus:true,  p:'Egg Whites' },

  { t:'Mexican Smoked Black Bean Bowl',       i:['1c Rice','1.75c Broth','1c Black Beans','1 tsp Smoked Paprika','1 tsp Cumin','1 Lime','--- Variation: add 1c Roasted Corn + 0.5 tsp Chili Powder for a Street Corn version ---'],                                m:'White Rice',  s:5, tex:'Hearty',        plus:true,  p:'Cooked Beef' },

  { t:'Mediterranean Chickpea Lemon Rice',    i:['1c Basmati','1.75c Broth','1c Chickpeas','1 tbsp Oregano','1 tsp Garlic','1 Lemon','--- Variation (Tomato Style): swap broth for 3c broth + 0.5c Tomato Puree, omit lemon — a richer, stew-style direction ---'],                                   m:'White Rice',  s:4, tex:'Fluffy',        plus:true,  p:'Cooked Chicken' },
  { t:'Greek Dill & Feta Rice',               i:['1c Rice','1.75c Water','1 tbsp Dill','0.5 tsp Garlic Powder','0.5c Feta'],                                             m:'White Rice',  s:4, tex:'Fresh',         plus:false, p:'Lemon-Herb Chicken' },
  { t:'Cuban Mojo Black Beans & Rice',        i:['1c Rice','1.75c Broth','1c Black Beans','0.5 tsp Cumin','1 tsp Garlic','1 tsp Oregano'],                              m:'White Rice',  s:5, tex:'Savory',        plus:false, p:'Pulled Pork' },
  { t:'Harissa Spiced Chickpea Grain',        i:['1c Rice','1.75c Water','1c Chickpeas','1 tbsp Harissa','1 tsp Coriander'],                                             m:'White Rice',  s:5, tex:'Bold',          plus:true,  p:'Ground Turkey' },
  { t:'Sesame Ginger Edamame Rice',           i:['1c Rice','1.75c Water','1c Edamame','1 tbsp Ginger','1 tbsp Soy Sauce','1 tsp Sesame Oil'],                           m:'White Rice',  s:4, tex:'Clean',         plus:false, p:'Shrimp' },
  { t:'Teriyaki Broccoli Tofu Rice',          i:['1c Short-Grain Rice','1.75c Water','2c Broccoli Florets','3 tbsp Teriyaki Sauce (or 2 tbsp soy + 1 tbsp honey + 0.5 tsp ginger)','1 tsp Sesame Oil (add after cook)','1 tbsp Sesame Seeds (topping)','2 Green Onions (sliced, garnish)','Tip: Press tofu dry between paper towels 15 min before adding — removes excess water so it absorbs sauce instead of steaming'],                                                m:'White Rice',  s:4, tex:'Sticky',        plus:false, p:'Extra-Firm Tofu (pressed and cubed)' },

  { t:'Indonesian Sweet Soy Rice',            i:['1c Rice','1.75c Water','1c Mixed Veg','2 tbsp Kecap Manis','1 tsp Coriander'],                                         m:'White Rice',  s:4, tex:'Saucy',         plus:false, p:'Lean Beef' },
  { t:'Indian Masala Quinoa Bowl',            i:['1c Quinoa','1.75c Broth','1c Mixed Veg','1 tsp Masala','0.5 tsp Turmeric','0.25 tsp Black Pepper'],                   m:'White Rice',  s:4, tex:'Grained',       plus:false, p:'Chickpeas' },
  { t:'Korean Bibimbap-Style Rice',           i:['1c Short-Grain Rice (essential for sticky texture — rinse until water runs clear)','1.75c Water','1c Mixed Veg (carrots, mushrooms, bean sprouts, zucchini)','1 tbsp Gochujang','1 tsp Sesame Oil','1 tsp Soy Sauce','0.5 tsp Sugar','1 tbsp Sesame Seeds (garnish)','Sunny-Side-Up Egg (serve on top — classic)'], m:'White Rice',  s:5, tex:'Sticky',        plus:true,  p:'Ground Beef (marinated in soy + garlic + sesame oil)', note:'Bibimbap Tip: Layer firm veg on top of rice before cook cycle. Add leafy greens (spinach, zucchini) AFTER cycle completes — close lid 3-5 min to steam them without overcooking.' },
  { t:'Tuscan Rosemary White Bean Rice',      i:['1c Rice','1.75c Broth','1c White Beans','1 tsp Rosemary','1 tsp Garlic','--- Stew Variation: remove rice, add 3c Broth + 1c Zucchini (diced) + 1 tsp Oregano — run Soup mode for a hearty Tuscan stew ---'],                                              m:'White Rice',  s:4, tex:'Rustic',        plus:false, p:'Chicken Sausage' },

  { t:'Classic Red Lentil Dal',               i:['1c Red Lentils (rinsed until water runs clear)','3c Water or Broth','0.5c Diced Tomatoes (fresh or canned)','1 tsp Turmeric','1 tsp Cumin','0.5 tsp Coriander','0.25 tsp Cayenne (adjust to taste)','Tadka: 1 tbsp Ghee or Oil','Tadka: 1 tsp Cumin Seeds','Tadka: 3 cloves Garlic (minced)','Tadka: 1 tsp Ginger (grated)','Fresh Cilantro + Lemon Juice (finish)'], m:'White Rice',  s:5, tex:'Creamy',        plus:true,  p:'Shredded Chicken', note:'Tadka Technique: Cook lentils with just turmeric + salt. While they cook, bloom Tadka spices in hot ghee on stovetop until fragrant (60 sec). Stir tadka into cooked dal — this is what separates great dal from average dal.' },
  { t:'Moroccan Spiced Beef & Lentils',       i:['1c Lentils','3c Water','0.5 tsp Cinnamon','1 tsp Paprika','1 tsp Cumin'],                                             m:'White Rice',  s:5, tex:'Aromatic',      plus:false, p:'Diced Beef' },
  { t:'Spinach & Turkey Red Lentil Stew',     i:['1c Red Lentils','3c Water','1 tsp Garlic','2c Spinach','1 Lemon'],                                                     m:'White Rice',  s:5, tex:'Smooth',        plus:false, p:'Ground Turkey' },
  { t:'Brown Lentil & Carrot Bowl',           i:['1c Brown Lentils (rinsed)','3c Vegetable Broth (not water — broth adds depth)','2 Carrots (diced)','0.5c Diced Tomatoes','1 tsp Cumin','0.5 tsp Coriander','0.5 tsp Smoked Paprika','1 tsp Garlic','1 tsp Ginger','1 Lemon (juice, add after cook)','Fresh Parsley or Cilantro (finish)'],                                                              m:'Whole Grain', s:5, tex:'Earthy',        plus:false, p:'Lean Beef or Lamb' },

  { t:'Taco Lentil Filling Grain Bowl',       i:['1c Brown Lentils','3c Water','2 tbsp Taco Spices','0.5c Salsa'],                                                       m:'Whole Grain', s:5, tex:'Hearty',        plus:false, p:'Ground Beef' },

  { t:'Smoky Pinto Bean & Bacon Stew',        i:['1c Pinto Beans','3c Broth','1 tsp Smoked Paprika','0.5c Bacon'],                                                      m:'White Rice',  s:5, tex:'Smoky',         plus:false, p:'Bacon' },


  { t:'Thai Curry Rice Pot',                  i:['1c Jasmine Rice','1.5c Water','0.5c Coconut Milk (stir in AFTER cook cycle — prevents curdling)','1 tbsp Fish Sauce (add after cook)','1 tbsp Fresh Lime Juice (add after cook)','0.5c Baby Spinach or Thai Basil (add after cook)','--- Choose Your Curry ---','GREEN: 1.5 tbsp Green Curry Paste — fresh, herbal, fragrant and spicy. Pairs with chicken.','MASSAMAN: 1.5 tbsp Massaman Paste + 1c Potato (chunked) + 1 tbsp Peanuts — sweet, nutty, mild. Pairs with beef.'],                                                                                                  m:'White Rice',  s:4, tex:'Coconut',       plus:false, p:'Sliced Chicken (Green) or Chuck Beef (Massaman)', note:'Thai Curry Tip: Cook rice + curry paste + protein together. Once cycle completes, stir in coconut milk, fish sauce, lime juice, and fresh herbs — adding them after preserves their bright flavor and prevents curdling.' },
  { t:'Vegetable Biryani Delight',            i:['1c Aged Basmati Rice (soaked 30 min, drained)','1.5c Water','1 pinch Saffron (bloomed in 2 tbsp warm milk)','1 tsp Garam Masala','0.5 tsp Turmeric','0.5 tsp Cumin','0.5c Mixed Veg (peas, carrots, beans)','1 Onion (fried golden — key for authentic flavor)','1 tbsp Ghee','Fresh Mint + Cilantro (layered in)'], m:'White Rice',  s:4, tex:'Fluffy',        plus:false, p:'Boiled Egg or Paneer', note:'Biryani Tip: Fry onions separately in ghee until deep golden brown — this is non-negotiable for authentic flavor. Bloom saffron in warm milk first. Layer fried onions + fresh herbs between rice and veg before starting cook cycle.' },
  { t:'Mild Gochujang Pork & Veg Rice',       i:['1c Rice','1.75c Water','1 tbsp Gochujang','1 tsp Ginger'],                                                            m:'White Rice',  s:4, tex:'Sticky',        plus:true,  p:'Pork Strips' },

  { t:'Peanut Lime Shrimp & Veggie Rice',     i:['1c Rice','1.75c Water','1.5 tbsp PB powder','1 tbsp Lime'],                                                           m:'White Rice',  s:4, tex:'Saucy',         plus:false, p:'Cooked Shrimp' },

  { t:'Beef Minestrone & Pasta Soup',         i:['0.5c Pasta','1c White Beans','4c Broth','1 tbsp Italian Spices'],                                                     m:'Soup',        s:5, tex:'Brothy',        plus:false, p:'Ground Beef' },
  { t:'Creamy Tomato Basil Chicken Soup',     i:['1.5c Tomato Puree','3c Broth','1 tsp Garlic','0.5c Milk'],                                                            m:'Soup',        s:4, tex:'Silky',         plus:false, p:'Shredded Chicken' },
  { t:'Potato & Ham Corn Chowder',            i:['2 Potatoes','1c Corn','3c Broth','0.5c Milk'],                                                                        m:'Soup',        s:5, tex:'Thick',         plus:false, p:'Diced Ham' },
  { t:'White Bean & Turkey Veggie Soup',      i:['1c White Beans','3.5c Broth','1 tsp Thyme','1 tsp Garlic'],                                                           m:'Soup',        s:4, tex:'Hearty',        plus:false, p:'Ground Turkey' },
  { t:'Moroccan Chickpea & Lamb Soup',        i:['1c Chickpeas','0.5c Lentils','4c Broth','1 tsp Cumin'],                                                               m:'Soup',        s:5, tex:'Aromatic',      plus:false, p:'Lamb Strips' },
  { t:'Miso Vegetable & Shrimp Soup',         i:['4c Water','1c Mixed Veg','2 tbsp Miso','1 tsp Ginger'],                                                               m:'Soup',        s:3, tex:'Light',         plus:false, p:'Small Shrimp' },
  { t:'Burrito Beef & Black Bean Soup',       i:['0.5c Rice','1c Beans','1c Corn','1 tbsp Chili Powder'],                                                               m:'Soup',        s:5, tex:'Zesty',         plus:false, p:'Lean Beef' },
  { t:'Coconut Lentil Chicken Soup Bowl',     i:['1c Lentils','3c Broth','0.5c Coconut Milk','0.5 tsp Turmeric'],                                                       m:'Soup',        s:5, tex:'Creamy',        plus:false, p:'Diced Chicken' },
];

export function buildCookerRecipes(rcSource) {
  return rcSource.map((r, i) => {
    const isBreakfast = r.m === 'Porridge' || r.t.includes('Breakfast') || r.t.includes('Oat') || r.t === 'Savory Spinach Egg Rice';
    const instructions = [
      'Maillard Prep: Sear ' + r.p + ' in a skillet first to build depth of flavor.',
      `Thermal Phase: Add grains, seared protein, and spices. Run ${r.m} cycle.`,
      isBreakfast && r.i.join().toLowerCase().includes('egg white')
        ? 'Egg White Tip: Add egg whites AFTER cooking completes, then whisk vigorously 60 seconds until fluffy — adding them at the start can cause scrambling.'
        : 'Rest Phase: Fluff and let steam for 5m before serving.',
      r.t.includes('Miso') ? 'Miso Note: Stir miso paste in AFTER cooking is done — never boil miso as it destroys its flavor and probiotics.' : 'Rest Phase: Fluff and let steam for 5m before serving.',
    ].filter((s, idx, arr) => arr.indexOf(s) === idx);

    // Append per-recipe technique note if present
    if (r.note) instructions.push(r.note);

    return {
      id: 100 + i,
      title: (r.plus ? '⚡ ' : '') + r.t,
      cat: isBreakfast ? 'RC-Breakfast' : 'Rice-Cooker',
      baseS: 4,
      ingredients: [...r.i, '0.5 tsp Salt', r.i.join().includes('Turmeric') ? '0.25 tsp Black Pepper' : '0.25 tsp Pepper'],
      instructions,
      proteinRec: `Pair with: ${r.p}`,
      satiety: r.s,
      texture: r.tex,
      isProteinPlus: r.plus,
    };
  });
}
