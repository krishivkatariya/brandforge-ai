import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { content, brand } = await request.json();
  if (!content || typeof content !== "string") return NextResponse.json({ error: "Content is required." }, { status: 400 });
  const generic = /comprehensive|solution|leverage|seamless/i.test(content);
  return NextResponse.json({
    decision: generic ? "REVISE" : "KEEP",
    overall: generic ? 62 : 88,
    problems: generic ? ["Generic corporate vocabulary", "Weak audience signal"] : [],
    explanation: generic ? "The content is understandable, but it does not sound like the selected brand voice." : "The content matches the current brand direction.",
    revised: generic ? `Build with the right people. ${brand?.tagline || "Find your next teammate and ship with momentum."}` : content,
  });
}