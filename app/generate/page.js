'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    activity: '',
    health: '',
    dietary: ''
  });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    // Save the meal plan along with target values and macros for later use
    localStorage.setItem('mealData', JSON.stringify({
      breakfast: data.breakfastRecipe,
      lunch: data.lunchRecipe,
      dinner: data.dinnerRecipe,
      breakfastName: data.breakfastName,
      lunchName: data.lunchName,
      dinnerName: data.dinnerName,
      breakfastCalories: data.breakfastCalories,
      lunchCalories: data.lunchCalories,
      dinnerCalories: data.dinnerCalories,
      breakfastProtein: data.breakfastProtein,
      lunchProtein: data.lunchProtein,
      dinnerProtein: data.dinnerProtein,
      breakfastFat: data.breakfastFat,
      lunchFat: data.lunchFat,
      dinnerFat: data.dinnerFat,
      breakfastCarbs: data.breakfastCarbs,
      lunchCarbs: data.lunchCarbs,
      dinnerCarbs: data.dinnerCarbs,
      targetCalories: data.targetCalories,
      dailyMacros: data.dailyMacros,
      health: form.health,
      dietary: form.dietary,
    }));

    router.push('/option');
  } catch (err) {
    console.error('API error:', err);
    alert('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};
  
  return (
    <main className="min-h-screen bg-white px-6 py-4 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="TheMEAL logo" width={100} height={100} />
          <h1 className="text-2xl font-lexend text-green-900 relative top-[15px] left-[-15px]">TheMEAL</h1>
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

      {/* Form Box */}
      <div className="bg-[#88d499] rounded-3xl border-2 border-green-900 p-8 md:p-10 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 text-green-900">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="font-semibold">Gender:</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-xl p-3 mt-1 bg-white">
                <option value="" disabled hidden>
                  Select Gender
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="font-semibold">Age:</label>
              <input name="age" value={form.age} type="number" onChange={handleChange} placeholder="Enter your age" className="w-full rounded-xl p-3 mt-1 bg-white" />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="font-semibold">Height:</label>
                <input name="height" value={form.height} type="text" onChange={handleChange} placeholder="Enter your height (cm)" className="w-full rounded-xl p-3 mt-1 bg-white" />
              </div>
              <div className="w-1/2">
                <label className="font-semibold">Weight:</label>
                <input name="weight" value={form.weight} type="text" onChange={handleChange} placeholder="Enter your weight (kg)" className="w-full rounded-xl p-3 mt-1 bg-white" />
              </div>
            </div>
            <div>
              <label className="font-semibold">Goal:</label>
              <select name="goal" value={form.goal} onChange={handleChange} className="w-full rounded-xl p-3 mt-1 bg-white">
                <option value="" disabled hidden>
                  Select Goal
                </option>
                <option>Lose Weight</option>
                <option>Maintain Weight</option>
                <option>Gain Weight</option>
              </select>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4 border-l border-green-900 pl-6">
            <div>
              <label className="font-semibold">Exercise Frequency:</label>
              <select name="activity" value={form.activity} onChange={handleChange} className="w-full rounded-xl p-3 mt-1 bg-white">
                <option value="" disabled hidden>
                  Select Frequency
                </option>
                <option>0-1 hr/week</option>
                <option>1-3 hrs/week</option>
                <option>3-6 hrs/week</option>
                <option>6-10 hrs/week</option>
                <option>10+ hrs/week</option>
              </select>
            </div>
            <div>
              <label className="font-semibold">Health Condition:</label>
              <select name="health" value={form.health} onChange={handleChange} className="w-full rounded-xl p-3 mt-1 bg-white">
                <option value="" disabled hidden>
                  Select Health Condition
                </option>
                <option>None</option>
                <option>Diabetes</option>
                <option>High Blood Pressure</option>
                <option>Other (Mention below)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold">Dietary Restriction:</label>
              <textarea name="dietary" value={form.dietary} onChange={handleChange}
                placeholder="Enter any dietary restrictions"
                className="w-full rounded-xl p-3 mt-1 h-28 resize-none bg-white"
              />
            </div>
          </div>
        </form>

        <style jsx>{`
          @keyframes zoomInOut {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.3);
            }
            100% {
              transform: scale(1);
            }
          }

          .loading-animation {
          animation: zoomInOut 1s infinite;
          }
        `}</style>
        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className={`px-10 py-3 bg-[#8b61c2] text-white rounded-full hover:bg-purple-700 font-semibold ${loading ? 'loading-animation' : ''}`}
            disabled={loading}
          >
            Generate Meals
          </button>
        </div>
      </div>
    </main>
  );
}