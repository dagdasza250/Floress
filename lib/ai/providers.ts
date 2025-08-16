export type AIMessage = { role: "user"|"assistant"|"system"; content: string; };
export type AIProvider = (msgs: AIMessage[]) => Promise<string>;

export const geminiProvider: AIProvider = async (msgs) => {
  const key = process.env.GEMINI_API_KEY!;
  // tu wywołaj Gemini (pseudokod, zależnie od SDK lub fetch)
  const prompt = msgs.map(m => `${m.role}: ${m.content}`).join("\n");
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key="+key, {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] })
  });
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text;
};