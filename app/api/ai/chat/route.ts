import { NextRequest, NextResponse } from "next/server";
import { geminiProvider, type AIMessage } from "@/lib/ai/providers";
import { detectCrisis } from "@/lib/ai/safety";

export const runtime = "edge";

export async function POST(req: NextRequest){
  const { messages }:{ messages: AIMessage[] } = await req.json();

  if (!messages?.length) return NextResponse.json({ error:"no-messages" }, { status:400 });

  // Safety pre-check
  const last = messages[messages.length-1].content;
  if (detectCrisis(last)){
    return NextResponse.json({
      crisis:true,
      message: "Widzę trudne treści. Kliknij przycisk Kryzysowy lub zadzwoń pod lokalny numer pomocy."
    }, { status:200 });
  }

  const provider = process.env.AI_PROVIDER === "gemini" ? geminiProvider : geminiProvider;
  const reply = await provider(messages);

  // Safety post-check
  const flagged = detectCrisis(reply);
  return NextResponse.json({ reply, flagged });
}