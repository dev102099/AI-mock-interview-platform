import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const { newMessage, prevMessage, statusViseMessage, rules } =
    await request.json();
  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  console.log(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: ` ${rules},  previous messages : These are the previous messages : ${prevMessage} ,
orders: ${statusViseMessage} users latest message : ${newMessage}`,
    config: { responseMimeType: "application/json" },
  });

  return new Response(
    JSON.stringify(response.candidates[0].content?.parts[0].text),
  );
}
