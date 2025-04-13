'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OptionPage() {
  const [selected, setSelected] = useState(null); // "breakfast" / "lunch" / "dinner" / null
  const [meals, setMeals] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
  });
  const [mealNames, setMealNames] = useState({
    breakfastName: '',
    lunchName: '',
    dinnerName: '',
  });
  const [mealRecipes, setMealRecipes] = useState({
    breakfast: { ingredients: [], recipe: [] },
    lunch: { ingredients: [], recipe: [] },
    dinner: { ingredients: [], recipe: [] },
  });
  const [mealNutrients, setMealNutrients] = useState({
    breakfast: { calories: '', protein: '', fat: '', carbs: '' },
    lunch: { calories: '', protein: '', fat: '', carbs: '' },
    dinner: { calories: '', protein: '', fat: '', carbs: '' },
  });

  useEffect(() => {
    const stored = localStorage.getItem('mealData');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMeals({
        breakfast: parsed.breakfast,
        lunch: parsed.lunch,
        dinner: parsed.dinner,
      });
      setMealNames({
        breakfastName: parsed.breakfastName,
        lunchName: parsed.lunchName,
        dinnerName: parsed.dinnerName,
      });
      // Set recipes – assuming recipe strings are stored with newline characters
      setMealRecipes({
        breakfast: { recipe: parsed.breakfast.split('\n'), ingredients: [] },
        lunch: { recipe: parsed.lunch.split('\n'), ingredients: [] },
        dinner: { recipe: parsed.dinner.split('\n'), ingredients: [] },
      });
      // Set nutrients
      setMealNutrients({
        breakfast: {
          calories: parsed.breakfastCalories,
          protein: parsed.breakfastProtein,
          fat: parsed.breakfastFat,
          carbs: parsed.breakfastCarbs,
        },
        lunch: {
          calories: parsed.lunchCalories,
          protein: parsed.lunchProtein,
          fat: parsed.lunchFat,
          carbs: parsed.lunchCarbs,
        },
        dinner: {
          calories: parsed.dinnerCalories,
          protein: parsed.dinnerProtein,
          fat: parsed.dinnerFat,
          carbs: parsed.dinnerCarbs,
        },
      });
    }
  }, []);

  // Add the regeneration function
  const handleRegenerate = async (mealType) => {
  const stored = JSON.parse(localStorage.getItem('mealData'));

  // Prepare the original nutritional values for the meal
  const originalMeal = {
    calories: Number(stored[`${mealType}Calories`]),
    protein: Number(stored[`${mealType}Protein`]),
    fat: Number(stored[`${mealType}Fat`]),
    carbs: Number(stored[`${mealType}Carbs`]),
  };

  // Prepare payload for the regeneration API
  const requestData = {
    regenMeal: mealType,
    targetCalories: stored.targetCalories,
    dailyMacros: stored.dailyMacros,
    breakfast: {
      calories: Number(stored.breakfastCalories),
      protein: Number(stored.breakfastProtein),
      fat: Number(stored.breakfastFat),
      carbs: Number(stored.breakfastCarbs),
    },
    lunch: {
      calories: Number(stored.lunchCalories),
      protein: Number(stored.lunchProtein),
      fat: Number(stored.lunchFat),
      carbs: Number(stored.lunchCarbs),
    },
    dinner: {
      calories: Number(stored.dinnerCalories),
      protein: Number(stored.dinnerProtein),
      fat: Number(stored.dinnerFat),
      carbs: Number(stored.dinnerCarbs),
    },
    // send health/dietary as needed
    health: stored.health || 'none',
    dietary: stored.dietary || 'none',
    // Pass the original meal nutritional values to ensure the same numbers are used:
    originalMeal,
  };

  try {
    const res = await fetch('/api/handler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    const data = await res.json();

    // Update the stored values for the regenerated meal
    stored[`${mealType}Name`] = data[`${mealType}Name`];
    stored[mealType] = data[`${mealType}Recipe`].join('\n'); // if recipe is returned as an array
    stored[`${mealType}Calories`] = data[`${mealType}Calories`];
    stored[`${mealType}Protein`] = data[`${mealType}Protein`];
    stored[`${mealType}Fat`] = data[`${mealType}Fat`];
    stored[`${mealType}Carbs`] = data[`${mealType}Carbs`];

    localStorage.setItem('mealData', JSON.stringify(stored));

    // Update state to reflect the regenerated meal
    setMealNames((prev) => ({ ...prev, [mealType + 'Name']: data[`${mealType}Name`] }));
    setMealRecipes((prev) => ({
      ...prev,
      [mealType]: {
        recipe: data[`${mealType}Recipe`],
        ingredients: data[`${mealType}Ingredients`] || [],
      },
    }));
    setMealNutrients((prev) => ({
      ...prev,
      [mealType]: {
        calories: data[`${mealType}Calories`],
        protein: data[`${mealType}Protein`],
        fat: data[`${mealType}Fat`],
        carbs: data[`${mealType}Carbs`],
      },
    }));

    // NOTE: Removed the alert call so no notification is shown.
    // alert(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} has been regenerated.`);
  } catch (err) {
    console.error('Error regenerating meal:', err);
    // Optionally, you can show a different kind of error display if needed.
  }
};

  return (
    <main className="min-h-screen bg-[#f5fff9] px-6 py-4 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="TheMEAL logo" width={100} height={100} />
          <h1 className="text-2xl font-lexend text-green-900  relative top-[15px] left-[-15px]">TheMEAL</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="text-green-900 font-semibold underline cursor-pointer">HOME</span>
          </Link>
          <svg className="w-6 h-6 text-green-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Conditional Layout */}
      {selected ? (
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Selected Meal Card */}
          <div className="bg-[#88d499] rounded-3xl p-6 flex flex-col items-center w-full max-w-sm">
            <h2 className="text-xl font-semibold text-green-900 mb-4 capitalize">{selected}:</h2>
            <div className="bg-white text-gray-700  rounded-xl p-4 w-full text-center mb-4 shadow min-h-[80px] flex items-center justify-center">
              {mealNames[selected + 'Name']}
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Nutrients:</h3>
            <div className="bg-white rounded-xl p-4 w-full shadow text-sm text-green-900">
              <p>Calories: {mealNutrients[selected]?.calories || 'N/A'} </p>
              <p>Protein: {mealNutrients[selected]?.protein || 'N/A'} </p>
              <p>Fat: {mealNutrients[selected]?.fat || 'N/A'} </p>
              <p>Carbs: {mealNutrients[selected]?.carbs || 'N/A'} </p>
            </div>
          </div>

          {/* Recipe Box */}
          <div className="relative bg-white rounded-2xl border border-green-900 p-4 w-full max-w-sm shadow-md">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-2xl font-bold text-green-800 hover:text-red-600"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-green-900 underline mb-2">RECIPE</h2>
            <p className="text-green-800 mb-2 font-semibold">{mealNames[selected + 'Name']}</p>
            <p className="whitespace-pre-line text-green-800 text-sm mb-2">
              {mealRecipes[selected].recipe.join('\n')}
            </p>
            <p className="whitespace-pre-line text-green-800 text-sm">
              {mealRecipes[selected].ingredients.join(', ')}
            </p>
          </div>
        </div>
      ) : (
        // Default 3-Meal Grid
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['breakfast', 'lunch', 'dinner'].map((type) => (
            <div key={type} className="flex flex-col items-center gap-4">
              {/* Meal Card */}
              <button
                onClick={() => setSelected(type)}
                className="bg-[#88d499] rounded-3xl p-6 flex flex-col items-center text-left cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-in-out w-full"
              >
                <h2 className="text-xl font-semibold text-green-900 mb-4 capitalize">{type}:</h2>
                <div className="bg-white text-gray-700 rounded-xl p-4 w-full text-center mb-4 shadow min-h-[80px] flex items-center justify-center">
                  {mealNames[`${type}Name`] || meals[type] || 'Loading...'}
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Nutrients:</h3>
                <div className="bg-white text-gray-700 rounded-xl p-4 w-full h-24 shadow">
                  <p>Calories: {mealNutrients[type]?.calories || 'N/A'} </p>
                  <p>Protein: {mealNutrients[type]?.protein || 'N/A'} </p>
                </div>
              </button>

              {/* Regenerate Button */}
              <button
                onClick={() => handleRegenerate(type)}
                className="bg-[#8b61c2] text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 w-full"
              >
                Regenerate Meal
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
