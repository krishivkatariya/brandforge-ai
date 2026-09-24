import { NextResponse } from "next/server";

const projects = new Map<string, Record<string, unknown>>();

export async function POST(request: Request) {
  const body = await request.json();
  const id = crypto.randomUUID();
  const project = { id, name: body.name || "Untitled project", idea: body.idea || "", stage: "discovery", createdAt: new Date().toISOString() };
  projects.set(id, project);
  return NextResponse.json(project, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ projects: Array.from(projects.values()) });
}