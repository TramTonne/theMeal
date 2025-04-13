'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GeneratePage() {
  // Controlled form inputs starting empty.
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [activity, setActivity] = useState('');
  const [health, setHealth] = useState('');
  const [dietary, setDietary] = useState('');

  // Result from the API.
  const [menuResult, setMenuResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handles form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gender,
          age,
          height,
          weight,
          goal,
          activity,
          health,
          dietary,
        }),
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setMenuResult(data.menu);
    } catch (err) {
      console.error('Error generating meal plan:', err);
      setError('Failed to generate meal plan. Please try again.');
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

      {/* Form Box */}
      <div className="bg-[#88d499] rounded-3xl border-2 border-green-900 p-8 md:p-10 w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 text-green-900">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="font-semibold">Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl p-3 mt-1 bg-white"
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="font-semibold">Age:</label>
              <input
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full rounded-xl p-3 mt-1 bg-white"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="font-semibold">Height (cm):</label>
                <input
                  type="text"
                  placeholder="Enter height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-xl p-3 mt-1 bg-white"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="font-semibold">Weight (kg):</label>
                <input
                  type="text"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-xl p-3 mt-1 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold">Goal:</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-xl p-3 mt-1 bg-white"
                required
              >
                <option value="" disabled>
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
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full rounded-xl p-3 mt-1 bg-white"
                required
              >
                <option value="" disabled>
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
              <select
                value={health}
                onChange={(e) => setHealth(e.target.value)}
                className="w-full rounded-xl p-3 mt-1 bg-white"
                required
              >
                <option value="" disabled>
                  Select Health Condition
                </option>
                <option>None</option>
                <option>Diabetes</option>
                <option>High Blood Pressure</option>
              </select>
            </div>

            <div>
              <label className="font-semibold">Dietary Restriction:</label>
              <textarea
                placeholder="Enter any dietary restrictions"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full rounded-xl p-3 mt-1 h-28 resize-none bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center md:col-span-2 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-[#8b61c2] text-white rounded-full hover:bg-purple-700 font-semibold"
            >
              {loading ? 'Generating...' : 'Generate Meals'}
            </button>
          </div>
        </form>

        {/* Display error if any */}
        {error && <p className="mt-4 text-red-600">{error}</p>}

        {/* Result Textbox */}
        {menuResult && (
          <div className="mt-8">
            <label className="font-semibold text-green-900">Your Meal Plan:</label>
            <textarea
              value={menuResult}
              readOnly
              rows={10}
              className="w-full rounded-xl p-3 mt-1 bg-white text-green-900"
            />
          </div>
        )}
      </div>
    </main>
  );
}
