'use client';

import Link from 'next/link';

<Link href="/generate" className="text-blue-500 underline">
  Go to Generate Page
</Link>

import { useState } from 'react';

export default function GeneratePage() {
  const [form, setForm] = useState({
    diet: '', calories: '', allergies: '', favorites: '', notes: ''
  });
  const [menu, setMenu] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMenu(data.menu);
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">One Day Menu Generator 🍽️</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {['diet', 'calories', 'allergies', 'favorites', 'notes'].map((key) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="text-lg font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                id={key}
                name={key}
                placeholder={key}
                value={form[key]}
                onChange={handleChange}
                className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ color: 'black' }}
              />
            </div>
          ))}
          
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Menu'}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Generated Menu</h2>
          <pre className="bg-gray-50 rounded-md p-4 whitespace-pre-wrap text-gray-800">{menu}</pre>
        </div>
      </div>
    </main>
  );
}
