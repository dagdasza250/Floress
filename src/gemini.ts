import fetch from 'node-fetch';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface GeminiResponse {
  text: string;
  crisis: boolean;
}

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const SOKRATES_PROMPT =
  'Jeste\u015b przewodnikiem stosuj\u0105cym metod\u0119 sokratejsk\u0105. Zadawaj pytania, aby pom\u00f3c rozm\u00f3wcy samodzielnie doj\u015b\u0107 do wniosk\u00f3w.';

export async function callGemini(messages: Message[]): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY missing');
  }

  const formatted = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  const body = {
    contents: [
      { parts: [{ text: SOKRATES_PROMPT }] },
      ...formatted,
    ],
  };

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data: any = await res.json();
  const text =
    data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
  const crisis = text.includes('KRYZYS_WYKRYTY');
  return {
    text: text.replace('KRYZYS_WYKRYTY', '').trim(),
    crisis,
  };
}
