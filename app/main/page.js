'use client';

import Image from 'next/image';

export default function GeneratePage() {
  return (
      <main className="min-h-screen bg-white px-6 py-4 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="TheMEAL logo" width={100} height={100} />
          <h1 className="text-2xl font-lexend text-green-900">TheMEAL</h1>
        </div>
        <div>
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      {/* Form Box */}
        <div
            className="rounded-3xl border-2 border-green-900 p-8 md:p-10 flex flex-col items-center w-full max-w-7xl mx-auto"
            style={{ backgroundColor: '#88d499' }}
        >

        <form className="w-full grid md:grid-cols-2 gap-x-8 gap-y-6 text-green-900">
          {/* Left Side */}
          <div>
            <label>Gender:</label>
            <select className="w-full rounded-md p-2 mt-1">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <label className="block mt-4">Age:</label>
            <input type="number" className="w-full rounded-md p-2 mt-1" />

            <label className="block mt-4">Height:</label>
            <input type="text" className="w-full rounded-md p-2 mt-1" />

            <label className="block mt-4">Weight:</label>
            <input type="text" className="w-full rounded-md p-2 mt-1" />

            <label className="block mt-4">Goal:</label>
            <select className="w-full rounded-md p-2 mt-1">
              <option>Lose Weight</option>
              <option>Maintain</option>
              <option>Gain Muscle</option>
            </select>

            <label className="block mt-4">Goal:</label>
            <select className="w-full rounded-md p-2 mt-1">
              <option>Short Term</option>
              <option>Long Term</option>
            </select>
          </div>

          {/* Right Side */}
          <div>
            <label>Type of Meal:</label>
            <select className="w-full rounded-md p-2 mt-1">
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
            </select>

            <label className="block mt-4">Health Condition:</label>
            <select className="w-full rounded-md p-2 mt-1">
              <option>None</option>
              <option>Diabetes</option>
              <option>High Blood Pressure</option>
            </select>

            <label className="block mt-4">Dietary Restriction:</label>
            <textarea className="w-full rounded-md p-2 mt-1 h-24" />
          </div>
        </form>

        {/* Button */}
        <button className="mt-8 px-10 py-3 bg-[#8b61c2] text-white rounded-full hover:bg-purple-700 font-semibold">
          Generate Meals
        </button>
      </div>
    </main>
  );
}
