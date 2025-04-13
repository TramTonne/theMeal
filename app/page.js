'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f5fff9] px-6 py-4 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="TheMEAL logo" width={100} height={100} />
          <h1 className="text-2xl font-lexend text-green-900 relative top-[15px] left-[-15px]">TheMEAL</h1>
        </div>
        <div>
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center flex-1 gap-10">
        {/* Left - Image */}
        <div className="w-full md:w-1/2">
          <Image 
            src="/images/home.png" 
            alt="Meal illustration" 
            width={600} 
            height={600} 
            className="max-w-full h-auto"
          />
        </div>

        {/* Right - Text and Button */}
        <div className="text-center md:text-left w-full md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold leading-snug">
            <span className="text-purple-600"
            style={{ fontFamily: 'sans-serif' }}>
              Plan your MEAL</span>{' '}
            <span className="text-green-500" 
            style={{ fontFamily: 'Source Serif Pro, serif' }}
            >for today.</span>
          </h2>
          <button
            onClick={() => router.push('/generate')}
            className="mt-10 px-8 py-4 bg-purple-500 text-white font-semibold text-lg rounded-full hover:bg-purple-600 transition"
          >
            GET STARTED
          </button>
        </div>
      </div>
    </main>
  );
}

