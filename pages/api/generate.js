export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { gender, age, height, weight, goal, activity, health, dietary } = req.body;

  // Set default values if any input is blank
  const defaultGender   = 'none';
  const defaultAge      = '25';
  const defaultHeight   = '170';
  const defaultWeight   = '70';
  const defaultGoal     = 'Maintain';
  const defaultActivity = '0-1 hr/week';
  const defaultHealth   = 'none';
  const defaultDietary  = 'none';

  const safeGender   = (gender && gender.trim()) ? gender.trim() : defaultGender;
  const safeAge      = (age && age.trim()) ? age.trim() : defaultAge;
  const safeHeight   = (height && height.trim()) ? height.trim() : defaultHeight;
  const safeWeight   = (weight && weight.trim()) ? weight.trim() : defaultWeight;
  const safeGoal     = (goal && goal.trim()) ? goal.trim() : defaultGoal;
  const safeActivity = (activity && activity.trim()) ? activity.trim() : defaultActivity;
  const safeHealth   = (health && health.trim()) ? health.trim() : defaultHealth;
  const safeDietary  = (dietary && dietary.trim()) ? dietary.trim() : defaultDietary;

  // Convert numeric inputs
  const w = Number(safeWeight);
  const h = Number(safeHeight);
  const a = Number(safeAge);

  // Convert activity input into a numerical rate
  const activityMap = {
    "0-1 hr/week": 1.2,
    "1-3 hrs/week": 1.375,
    "3-6 hrs/week": 1.55,
    "6-10 hrs/week": 1.725,
    "10+ hrs/week": 1.9,
  };
  const actFactor = activityMap[safeActivity] || 1.2;

  // Calculate Basal Metabolic Rate (BMR)
  let BMR;
  if (safeGender === 'Male') {
    BMR = 13.397 * w + 4.799 * h - 5.677 * a + 88.362;
  } else if (safeGender === 'Female') {
    BMR = 9.247 * w + 3.098 * h - 4.330 * a + 447.593;
  } else {
    BMR = (13.397 * w + 4.799 * h - 5.677 * a + 88.362 +
           9.247 * w + 3.098 * h - 4.330 * a + 447.593) / 2;
  }

  // Calculate Total Daily Energy Expenditure (TDEE)
  const TDEE = BMR * actFactor;

  // Adjust calories based on goal
  const delta = 500; // ~0.5 kg/week adjustment
  let targetCalories = TDEE;
  if (safeGoal == 'Lose Weight') {
    targetCalories = TDEE - delta;
  } else if (safeGoal == 'Gain Weight') {
    targetCalories = TDEE + delta;
  }
  targetCalories = Math.round(targetCalories);

  // Calculate daily macronutrients
  const totalProtein = Math.round((targetCalories * 0.25) / 4);
  const totalFat     = Math.round((targetCalories * 0.25) / 9);
  const totalCarbs   = Math.round((targetCalories * 0.50) / 4);

  // Build prompt for the AI
  const prompt = `
You are a nutritionist. Create a 1‑day meal plan with only Breakfast, Lunch, and Dinner that meets:
- Daily Calories: ${targetCalories} kcal
- Daily Protein: ${totalProtein}g
- Daily Fat: ${totalFat}g
- Daily Carbs: ${totalCarbs}g
- Health condition: ${safeHealth}
- Dietary restriction: ${safeDietary}

Ensure that the per‑meal nutritional values add up exactly to the daily totals provided. The nutritional values don't need to be spread evenly across meals, but they should be reasonable. The meal plan should be diverse and include a variety of ingredients.

For each meal, output exactly in this format:

Breakfast:
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

Lunch:
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

Dinner:
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
  const openaiRes = await fetch(
    'https://api.openai.com/v1/chat/completions', {
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
    }
  );

  const responseData = await openaiRes.json();
  const rawMealPlanText = responseData.choices?.[0]?.message?.content || '';

  // Parse the returned meal plan text
  function parseMealPlan(text) {
    // Split into blocks based on meal headers
    const blocks = text.split(/\n(?=(Breakfast:|Lunch:|Dinner:))/g);
    const result = {};

    blocks.forEach(block => {
      const lines = block.trim().split('\n').map(l => l.trim());
      const mealKey = lines[0].replace(':', '').toLowerCase();

      let name = '';
      let mealCalories = '';
      let mealProtein  = '';
      let mealFat      = '';
      let mealCarbs    = '';
      const ingredients = [];
      const recipe = [];

      let mode = null;  // Switch between ingredients and recipe sections

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('Name:')) {
          name = line.replace('Name:', '').trim();
        } else if (line.startsWith('Calories:')) {
          mealCalories = line.replace('Calories:', '').trim();
        } else if (line.startsWith('Protein:')) {
          mealProtein = line.replace('Protein:', '').trim();
        } else if (line.startsWith('Fat:')) {
          mealFat = line.replace('Fat:', '').trim();
        } else if (line.startsWith('Carbs:')) {
          mealCarbs = line.replace('Carbs:', '').trim();
        } else if (line.startsWith('Ingredients:')) {
          mode = 'ingredients';
        } else if (line.startsWith('Recipe:')) {
          mode = 'recipe';
        } else if (/^\d+\.\s+/.test(line) && mode) {
          const item = line.replace(/^\d+\.\s+/, '').trim();
          if (mode === 'ingredients') {
            ingredients.push(item);
          } else if (mode === 'recipe') {
            recipe.push(item);
          }
        }
      }
      result[mealKey] = {
        name,
        calories: mealCalories,
        protein: mealProtein,
        fat: mealFat,
        carbs: mealCarbs,
        ingredients,
        recipe
      };
    });
    return result;
  }

  const mealPlanObject = parseMealPlan(rawMealPlanText.trim());

  function formatList(items) {
    return items.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
  }

  // Return the combined data broken into parts for the front end
  res.status(200).json({
    targetCalories,
    dailyMacros: { protein: totalProtein, fat: totalFat, carbs: totalCarbs },

    breakfastName: mealPlanObject.breakfast.name,
    breakfastIngredients: formatList(mealPlanObject.breakfast.ingredients),
    breakfastRecipe: formatList(mealPlanObject.breakfast.recipe),
    breakfastCalories: mealPlanObject.breakfast.calories,
    breakfastProtein: mealPlanObject.breakfast.protein,
    breakfastFat: mealPlanObject.breakfast.fat,
    breakfastCarbs: mealPlanObject.breakfast.carbs,
    
    lunchName: mealPlanObject.lunch.name,
    lunchIngredients: formatList(mealPlanObject.lunch.ingredients),
    lunchRecipe: formatList(mealPlanObject.lunch.recipe),
    lunchCalories: mealPlanObject.lunch.calories,
    lunchProtein: mealPlanObject.lunch.protein,
    lunchFat: mealPlanObject.lunch.fat,
    lunchCarbs: mealPlanObject.lunch.carbs,
    
    dinnerName: mealPlanObject.dinner.name,
    dinnerIngredients: formatList(mealPlanObject.dinner.ingredients),
    dinnerRecipe: formatList(mealPlanObject.dinner.recipe),
    dinnerCalories: mealPlanObject.dinner.calories,
    dinnerProtein: mealPlanObject.dinner.protein,
    dinnerFat: mealPlanObject.dinner.fat,
    dinnerCarbs: mealPlanObject.dinner.carbs,

    // The raw response for debugging
    rawMealPlanText: rawMealPlanText.trim(),
  });
}
