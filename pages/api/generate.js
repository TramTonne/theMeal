export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { diet, calories, allergies, favorites, notes } = req.body;

  const prompt = `
You are a helpful meal planner. Create a 1-day meal plan with breakfast, lunch, and dinner only, that fits:
- Diet: ${diet}
- Calorie goal: ${calories}
- Allergies: ${allergies}
- Favorite cuisines: ${favorites}
- Notes: ${notes}
Respond in a clear format, listing *only* breakfast, lunch, and dinner.
  `;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  const data = await openaiRes.json();
  const message = data.choices?.[0]?.message?.content || 'Something went wrong.';
  res.status(200).json({ menu: message });
}
