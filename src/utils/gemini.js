// Gemini API helper. Expects key in Vite env: VITE_GEMINI_API_KEY.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const endpoint =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';

export const callGemini = async (prompt) => {
  if (!apiKey) {
    return 'AI key missing. Set VITE_GEMINI_API_KEY to enable responses.';
  }

  try {
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    if (!response.ok) throw new Error('API Call Failed');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
  } catch (error) {
    console.error('Gemini Error:', error);
    return "I'm having trouble connecting to the AI services right now. Please try again later.";
  }
};

