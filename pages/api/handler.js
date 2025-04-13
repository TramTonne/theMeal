export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // Extract parameters from request body
  const {
    regenMeal, targetCalories, dailyMacros,
    breakfast, lunch, dinner,
    health = 'none',
    dietary = 'none',
    originalMeal,
  } = req.body;

  // Validate the meal requested for regeneration
  const validMeals = ['breakfast', 'lunch', 'dinner'];
  if (!regenMeal || !validMeals.includes(regenMeal)) {
    return res.status(400).json({ error: "regenMeal must be 'breakfast', 'lunch', or 'dinner'" });
  }

  // Determine the unchanged meals
  let otherMeals;
  if (regenMeal === 'breakfast') {
    otherMeals = [lunch, dinner];
  } else if (regenMeal === 'lunch') {
    otherMeals = [breakfast, dinner];
  } else {
    otherMeals = [breakfast, lunch];
  }

  // Calculate the nutritional requirements for the regenerated meal
  let regenCalories, regenProtein, regenFat, regenCarbs;
  if (originalMeal) {
    regenCalories = Number(originalMeal.calories);
    regenProtein  = Number(originalMeal.protein);
    regenFat      = Number(originalMeal.fat);
    regenCarbs    = Number(originalMeal.carbs);
  } else {
    // Sum the nutritional values of the unchanged meals
    const sumCalories = otherMeals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
    const sumProtein  = otherMeals.reduce((sum, meal) => sum + Number(meal.protein || 0), 0);
    const sumFat      = otherMeals.reduce((sum, meal) => sum + Number(meal.fat || 0), 0);
    const sumCarbs    = otherMeals.reduce((sum, meal) => sum + Number(meal.carbs || 0), 0);

    regenCalories = targetCalories - sumCalories;
    regenProtein  = dailyMacros.protein - sumProtein;
    regenFat      = dailyMacros.fat - sumFat;
    regenCarbs    = dailyMacros.carbs - sumCarbs;
  }

  // Build prompt
  const prompt = `
You are a nutritionist. Regenerate the ${regenMeal} meal for a 1‑day meal plan so that its nutritional values exactly meet:
- Calories: ${regenCalories} kcal
- Protein: ${regenProtein}g
- Fat: ${regenFat}g
- Carbs: ${regenCarbs}g
- Health condition: ${health}
- Dietary restriction: ${dietary}

Output the ${regenMeal} exactly in this format:

${regenMeal.charAt(0).toUpperCase() + regenMeal.slice(1)}:
Name: <Name of the dish>
Calories: <Meal calories>
Protein: <Meal protein in grams>
Fat: <Meal fat in grams>
Carbs: <Meal carbs in grams>
Ingredients:
1. <Ingredient 1>
2. <Ingredient 2>
3. ...
Recipe:
1. <Step 1>
2. <Step 2>
3. ...

Do not include any extra text, numbering outside these lists, or explanations—just these seven sections.
  `;

  // Call OpenAI API
  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });
  const openaiData = await openaiRes.json();
  const regeneratedText = openaiData.choices?.[0]?.message?.content || '';

  // Parse the regenerated meal text
  function parseSingleMeal(text) {
    const lines = text.trim().split('\n').map(l => l.trim());
    lines.shift();

    let name = '';
    let calories = '';
    let protein = '';
    let fat = '';
    let carbs = '';
    const ingredients = [];
    const recipe = [];

    let mode = null;  // switch between ingredients and recipe sections

    lines.forEach(line => {
      if (line.startsWith('Name:')) {
        name = line.replace('Name:', '').trim();
      } else if (line.startsWith('Calories:')) {
        calories = line.replace('Calories:', '').trim();
      } else if (line.startsWith('Protein:')) {
        protein = line.replace('Protein:', '').trim();
      } else if (line.startsWith('Fat:')) {
        fat = line.replace('Fat:', '').trim();
      } else if (line.startsWith('Carbs:')) {
        carbs = line.replace('Carbs:', '').trim();
      } else if (line.startsWith('Ingredients:')) {
        mode = 'ingredients';
      } else if (line.startsWith('Recipe:')) {
        mode = 'recipe';
      } else if (/^\d+\.\s+/.test(line) && mode) {
        const item = line.replace(/^\d+\.\s+/, '').trim();
        if (mode === 'ingredients') ingredients.push(item);
        else if (mode === 'recipe') recipe.push(item);
      }
    });

    return { name, calories, protein, fat, carbs, ingredients, recipe };
  }

  const regeneratedMeal = parseSingleMeal(regeneratedText);

  // Create the updated full meal plan
  const newMealPlan = {
    breakfast: regenMeal === 'breakfast' ? regeneratedMeal : breakfast,
    lunch: regenMeal === 'lunch' ? regeneratedMeal : lunch,
    dinner: regenMeal === 'dinner' ? regeneratedMeal : dinner,
  };

  // Return updated data for the front end
  res.status(200).json({
    targetCalories,
    dailyMacros,
    
    breakfastName: newMealPlan.breakfast.name,
    breakfastIngredients: newMealPlan.breakfast.ingredients,
    breakfastRecipe: newMealPlan.breakfast.recipe,
    breakfastCalories: newMealPlan.breakfast.calories,
    breakfastProtein: newMealPlan.breakfast.protein,
    breakfastFat: newMealPlan.breakfast.fat,
    breakfastCarbs: newMealPlan.breakfast.carbs,
    
    lunchName: newMealPlan.lunch.name,
    lunchIngredients: newMealPlan.lunch.ingredients,
    lunchRecipe: newMealPlan.lunch.recipe,
    lunchCalories: newMealPlan.lunch.calories,
    lunchProtein: newMealPlan.lunch.protein,
    lunchFat: newMealPlan.lunch.fat,
    lunchCarbs: newMealPlan.lunch.carbs,
    
    dinnerName: newMealPlan.dinner.name,
    dinnerIngredients: newMealPlan.dinner.ingredients,
    dinnerRecipe: newMealPlan.dinner.recipe,
    dinnerCalories: newMealPlan.dinner.calories,
    dinnerProtein: newMealPlan.dinner.protein,
    dinnerFat: newMealPlan.dinner.fat,
    dinnerCarbs: newMealPlan.dinner.carbs,

    // The raw response for debugging
    regeneratedMealRawText: regeneratedText.trim()
  });
}
