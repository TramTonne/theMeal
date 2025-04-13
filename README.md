```markdown
# TheMEAL

**TheMEAL** is a Next.js application that generates a personalized 1‑day meal plan based on user inputs such as gender, age, height, weight, goals, activity level, health conditions, and dietary restrictions. It also allows users to regenerate a single meal while keeping the nutritional values of the other meals unchanged.

---

## Features

- **Personalized Meal Plans**: Generates breakfast, lunch, and dinner with detailed nutritional breakdowns.
- **Meal Regeneration**: Regenerate a specific meal without changing its targeted nutritional values.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS  
- **Backend**: Next.js API Routes  
- **API**: OpenAI GPT‑4 (used for generating meal plans)

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/themeal.git
   cd themeal
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   Create a `.env.local` file in the root directory with the following:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:  
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📋 Usage

- **Generate Meal Plan**:  
  Fill out the form on the **Generate** page and click **"Generate Meals"**.

- **Regenerate a Meal**:  
  On the **Options** page, click **"Regenerate Meal"** on the desired meal card to update it while maintaining the original nutritional targets.


```

Let me know if you'd like a badge section (e.g., for build, license, or OpenAI usage), or if you want this in a more minimalistic or more styled version!
