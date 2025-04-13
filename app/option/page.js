'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function OptionPage() {
    const [meals, setMeals] = useState({
        breakfast: 'Loading...',
        lunch: 'Loading...',
        dinner: 'Loading...',
      });
    
      const [loading, setLoading] = useState({
        breakfast: false,
        lunch: false,
        dinner: false,
      });
    
      const generateMeal = async (mealType) => {
        setLoading((prev) => ({ ...prev, [mealType]: true }));
    
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: mealType }), // or pass additional context if needed
          });
    
          const data = await res.json();
    
          setMeals((prev) => ({
            ...prev,
            [mealType]: data.menu || 'No response',
          }));
        } catch (error) {
          setMeals((prev) => ({
            ...prev,
            [mealType]: 'Error generating meal',
          }));
        } finally {
          setLoading((prev) => ({ ...prev, [mealType]: false }));
        }
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

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['breakfast', 'lunch', 'dinner'].map((type) => (
          <div key={type} className="bg-[#88d499] rounded-3xl p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-green-900 mb-4 capitalize">{type}:</h2>

            <div className="bg-white rounded-xl p-4 w-full text-center mb-4 shadow min-h-[80px] flex items-center justify-center">
              {loading[type] ? 'Generating...' : meals[type]}
            </div>

            <h3 className="text-lg font-semibold text-green-900 mb-2">Nutrients:</h3>
            <div className="bg-white rounded-xl p-4 w-full h-24 shadow"></div>

            <button
              onClick={() => generateMeal(type)}
              disabled={loading[type]}
              className="mt-6 bg-[#8b61c2] text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 disabled:opacity-50"
            >
              {loading[type] ? 'Loading...' : 'Re-generate Meal'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

