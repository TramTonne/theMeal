export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // --- Extract input values in the specified order ---
  // Expected order: gender, age, height, weight, goal, activity, health, dietary.
  const { gender, age, height, weight, goal, activity, health, dietary } = req.body;

  // --- Set default values if any input is blank ---
  const defaultGender   = 'none';
  const defaultAge      = '25';
  const defaultHeight   = '170';
  const defaultWeight   = '70';
  const defaultGoal     = 'Maintain'; // Options: "Lose Weight", "Maintain", "Gain Weight"
  const defaultActivity = '0-1 hr/week';
  const defaultHealth   = 'none';
  const defaultDietary  = 'none';

  const safeGender   = (gender && gender.trim())   ? gender.trim()   : defaultGender;
  const safeAge      = (age && age.trim())      ? age.trim()      : defaultAge;
  const safeHeight   = (height && height.trim())   ? height.trim()   : defaultHeight;
  const safeWeight   = (weight && weight.trim())   ? weight.trim()   : defaultWeight;
  const safeGoal     = (goal && goal.trim())     ? goal.trim()     : defaultGoal;
  const safeActivity = (activity && activity.trim()) ? activity.trim() : defaultActivity;
  const safeHealth   = (health && health.trim())   ? health.trim()   : defaultHealth;
  const safeDietary  = (dietary && dietary.trim()) ? dietary.trim()  : defaultDietary;

  // --- Convert numeric inputs ---
  const w = Number(safeWeight);
  const h = Number(safeHeight);
  const a = Number(safeAge);

  // --- Convert activity input into a numerical rate ---
  const activityMap = {
    "0-1 hr/week": 1.2,
    "1-3 hrs/week": 1.375,
    "3-6 hrs/week": 1.55,
    "6-10 hrs/week": 1.725,
    "10+ hrs/week": 1.9,
  };
  const actFactor = activityMap[safeActivity] || 1.2;

  // --- Calculate Basal Metabolic Rate (BMR) ---
  let BMR;
  if (safeGender.toLowerCase() === 'Male') {
    BMR = 13.397 * w + 4.799 * h - 5.677 * a + 88.362;
  } else if (safeGender.toLowerCase() === 'Female') {
    BMR = 9.247 * w + 3.098 * h - 4.330 * a + 447.593;
  } else {
    // Use an average of male and female formulas if gender is not clearly specified.
    BMR = (13.397 * w + 4.799 * h - 5.677 * a + 88.362 +
           9.247 * w + 3.098 * h - 4.330 * a + 447.593) / 2;
  }

  // --- Calculate Total Daily Energy Expenditure (TDEE) ---
  const TDEE = BMR * actFactor;

  // --- Adjust calories based on goal ---
  const goalLower = safeGoal.toLowerCase();
  const delta = 500; // roughly 0.5 kg/week adjustment
  let targetCalories = TDEE;
  if (goalLower.includes('Lose Weight')) {
    targetCalories = TDEE - delta;
  } else if (goalLower.includes('Gain Weight')) {
    targetCalories = TDEE + delta;
  }
  targetCalories = Math.round(targetCalories);

  // --- Calculate daily macronutrients using fixed ratios ---
  const totalProtein = Math.round((targetCalories * 0.25) / 4);
  const totalFat     = Math.round((targetCalories * 0.25) / 9);
  const totalCarbs   = Math.round((targetCalories * 0.50) / 4);

  // --- Build Prompt for the AI ---
  // In addition to the overall daily calories and macros, we instruct the AI to output for each meal:
  // Name, per-meal Calories, Protein, Fat, Carbs, Ingredients, and Recipe.
  const prompt = `
You are a nutritionist. Create a 1‑day meal plan with only Breakfast, Lunch, and Dinner that meets:
- Daily Calories: ${targetCalories} kcal
- Daily Protein: ${totalProtein}g
- Daily Fat: ${totalFat}g
- Daily Carbs: ${totalCarbs}g
- Health condition: ${safeHealth}
- Dietary restriction: ${safeDietary}

Ensure that the per‑meal nutritional values add up exactly to the daily totals provided.
The meal plan should be balanced and include a variety of foods. Use common ingredients and recipes that are easy to prepare.

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

Do not include any extra text, numbering outside these lists, or explanations—just these three sections.
  `;

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

  const data = await openaiRes.json();
  const message = data.choices?.[0]?.message?.content || 'Something went wrong.';

  // --- Split the message into sections ---
  const [_, breakfastPart, lunchPart, dinnerPart] = message.split(/(?:\r?\n){2}(?=Lunch:|Dinner:|Breakfast:)/);

  // --- Extract meal names from each section ---
  function extractName(section) {
    const match = section.match(/Name:\s*(.*)/);
    return match ? match[1].trim() : 'Unknown';
  }

  const breakfastName = extractName(breakfastPart);
  const lunchName     = extractName(lunchPart);
  const dinnerName    = extractName(dinnerPart);

  console.log('Generated meal names:', {
    breakfastName,
    lunchName,
    dinnerName
  });

  res.status(200).json({
    menu: message,
    breakfast: breakfastPart,
    lunch: lunchPart,
    dinner: dinnerPart,
    breakfastName,
    lunchName,
    dinnerName
  });
}

