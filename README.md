TheMEAL
TheMEAL is a Next.js application that generates a personalized 1‑day meal plan based on user inputs (e.g., gender, age, height, weight, goal, activity, health condition, and dietary restrictions). It also allows users to regenerate a single meal while keeping the nutritional values for the other meals unchanged.

Features
Personalized Meal Plans: Generates breakfast, lunch, and dinner with exact nutritional breakdowns.
Meal Regeneration: Regenerate a specific meal without changing its targeted nutritional values.

Tech Stack
Frontend: Next.js (React), Tailwind CSS
Backend: Next.js API Routes
API: OpenAI GPT‑4 for meal planning

Installation
Clone the Repository:
git clone https://github.com/yourusername/themeal.git
cd themeal

Install Dependencies:
npm install

Configure Environment Variables:
Create a .env.local file in the root with:
OPENAI_API_KEY=your_openai_api_key_here

Run the Development Server:
npm run dev

Open http://localhost:3000 in your browser.

Usage
Generate Meal Plan: Fill out the form on the generate page and click "Generate Meals".
Regenerate a Meal: On the options page, click “Regenerate Meal” on the desired meal card to update it while keeping its original nutritional targets.
