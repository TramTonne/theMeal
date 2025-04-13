// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';

// export default function OptionPage() {
//     const [meals, setMeals] = useState({
//         breakfast: 'Loading...',
//         lunch: 'Loading...',
//         dinner: 'Loading...',
//       });
    
//       const [loading, setLoading] = useState({
//         breakfast: false,
//         lunch: false,
//         dinner: false,
//       });
    
//       const generateMeal = async (mealType) => {
//         setLoading((prev) => ({ ...prev, [mealType]: true }));
    
//         try {
//           const res = await fetch('/api/generate', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ type: mealType }), // or pass additional context if needed
//           });
    
//           const data = await res.json();
    
//           setMeals((prev) => ({
//             ...prev,
//             [mealType]: data.menu || 'No response',
//           }));
//         } catch (error) {
//           setMeals((prev) => ({
//             ...prev,
//             [mealType]: 'Error generating meal',
//           }));
//         } finally {
//           setLoading((prev) => ({ ...prev, [mealType]: false }));
//         }
//       };
    
//   return (
//     <main className="min-h-screen bg-white px-6 py-4 flex flex-col">
//     {/* Top Bar */}
//     <div className="flex justify-between items-center mb-12">
//     <div className="flex items-center gap-3">
//         <Image src="/images/logo.png" alt="TheMEAL logo" width={100} height={100} />
//         <h1 className="text-2xl font-lexend text-green-900">TheMEAL</h1>
//     </div>
//     <div className="flex items-center gap-4">
//           <Link href="/">
//             <span className="text-green-900 font-semibold underline cursor-pointer">HOME</span>
//           </Link>
//           <svg className="w-6 h-6 text-green-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         </div>
//     </div>

//       {/* Meals Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//     {['breakfast', 'lunch', 'dinner'].map((type) => (
//         <button
//         key={type}
//         onClick={() => generateMeal(type)}
//         disabled={loading[type]}
//         className="bg-[#88d499] rounded-3xl p-6 flex flex-col items-center text-left cursor-pointer 
//            hover:scale-[1.02] hover:shadow-2xl hover:ring-4 hover:ring-purple-300
//            transition-all duration-300 ease-in-out focus:outline-none disabled:opacity-50"
//         >
//         <h2 className="text-xl font-semibold text-green-900 mb-4 capitalize">{type}:</h2>

//         <div className="bg-white rounded-xl p-4 w-full text-center mb-4 shadow min-h-[80px] flex items-center justify-center">
//             {loading[type] ? 'Generating...' : meals[type]}
//         </div>

//         <h3 className="text-lg font-semibold text-green-900 mb-2">Nutrients:</h3>
//         <div className="bg-white rounded-xl p-4 w-full h-24 shadow"></div>

//         <span className="mt-6 bg-[#8b61c2] text-white px-6 py-2 rounded-full shadow hover:bg-purple-700">
//             {loading[type] ? 'Loading...' : 'Re-generate Meal'}
//         </span>
//         </button>

//         ))}

//       </div>
//     </main>
//   );
// }

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OptionPage() {
  const [selected, setSelected] = useState(null); // breakfast / lunch / dinner / null
  const [meals, setMeals] = useState({
    breakfast: 'Protein Shake and Banana',
    lunch: 'Chicken Noodle Soup',
    dinner: 'Caesar Salad and Chicken Breast',
  });

  const recipes = {
    breakfast: {
      title: 'Pancake Ingredients',
      content: `· Flour\n· Baking powder\n· Sugar\n· Salt\n· Milk and butter\n· Egg`,
      instructions: `How to Make Pancakes From Scratch\n1. Sift the dry ingredients together.\n2. Make a well, then add the wet ingredients. Stir to combine.`,
      image: '/images/pancakes.jpg', // Add this image to public/images
    },
    lunch: {
      title: 'Chicken Soup Recipe',
      content: `· Chicken\n· Noodles\n· Carrots\n· Celery\n· Onion`,
      instructions: `Boil chicken. Add veggies & noodles. Simmer 20 mins.`,
      image: '/images/soup.jpg',
    },
    dinner: {
      title: 'Salad + Chicken',
      content: `· Romaine lettuce\n· Grilled chicken\n· Caesar dressing\n· Croutons`,
      instructions: `Grill chicken, mix with salad & dressing.`,
      image: '/images/salad.jpg',
    },
  };

  return (
    <main className="min-h-screen bg-white px-6 py-4 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="TheMEAL logo" width={100} height={100} />
          <h1 className="text-2xl font-lexend text-green-900">TheMEAL</h1>
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

      {/* CONDITIONAL LAYOUT */}
      {selected ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Selected Meal Card */}
          <div className="bg-[#88d499] rounded-3xl p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-green-900 mb-4 capitalize">{selected}:</h2>
            <div className="bg-white rounded-xl p-4 w-full text-center mb-4 shadow min-h-[80px] flex items-center justify-center">
              {meals[selected]}
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Nutrients:</h3>
            <div className="bg-white rounded-xl p-4 w-full h-24 shadow"></div>
          </div>

          {/* Recipe Box */}
          <div className="relative bg-white rounded-3xl border-2 border-green-900 p-6">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-3xl font-bold text-green-800 hover:text-red-600"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-green-900 underline mb-4">RECIPE:</h2>
            <p className="whitespace-pre-line text-green-800 mb-4">{recipes[selected].title}</p>
            <p className="whitespace-pre-line text-green-800 mb-4">{recipes[selected].content}</p>
            <p className="whitespace-pre-line text-green-800">{recipes[selected].instructions}</p>

            <div className="mt-4 rounded-xl overflow-hidden">
              <Image src={recipes[selected].image} alt="Recipe" width={400} height={300} className="rounded-xl" />
            </div>
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
            className="bg-[#88d499] rounded-3xl p-6 flex flex-col items-center text-left cursor-pointer 
                        hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 ease-in-out w-full"
            >
            <h2 className="text-xl font-semibold text-green-900 mb-4 capitalize">{type}:</h2>
            <div className="bg-white rounded-xl p-4 w-full text-center mb-4 shadow min-h-[80px] flex items-center justify-center">
                {meals[type]}
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Nutrients:</h3>
            <div className="bg-white rounded-xl p-4 w-full h-24 shadow"></div>
            </button>

            {/* Regenerate Button (below the card) */}
            <button
            onClick={() => generateMeal(type)}
            className="bg-[#8b61c2] text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 w-full"
            >
            Re-generate Meal
            </button>
        </div>
        ))}

        </div>
      )}
    </main>
  );
}
