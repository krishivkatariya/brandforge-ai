# BrandForge AI

**Build it. Challenge it. Brand it.**

BrandForge is a structured AI brand strategy studio for turning a rough product idea into a coherent, launch-ready brand system. It is designed to show the reasoning between stages rather than hide everything inside a single prompt.

## What is implemented

- End-to-end MVP: rough idea -> adaptive discovery -> positioning -> personality -> Brand Battle -> critic -> selection -> final Brand Kit.
- Demo Mode with a complete Campus Relay example and structured outputs.
- Build From Scratch mode for any user-submitted project name and idea.
- Validated Pydantic `BrandState` carried across the FastAPI workflow.
- Provider-neutral LLM service using `LLM_API_KEY`, `LLM_BASE_URL`, and `LLM_MODEL` with a deterministic fallback.
- FastAPI routes for projects, discovery, positioning, personality, battle, critic, and direction selection.
- Visual Identity, Brand Voice, Brand Guardian, Launch Content, Workflow, and Brand Kit stages.
- Responsive premium workflow UI with loading and error states.

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- FastAPI, Pydantic 2 (optional live backend)
- Local browser persistence for the demo and a provider-agnostic LLM boundary

## Run the frontend

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Use Python 3.10+ for the backend. The verified local environment uses Python 3.12:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Environment variables

Copy `.env.example` to `.env.local` for the frontend and to `backend/.env` for the API when using live generation.

- `LLM_API_KEY`: server-side provider key; never expose it as a `NEXT_PUBLIC_` variable.
- `LLM_BASE_URL`: OpenAI-compatible provider endpoint.
- `LLM_MODEL`: model identifier, defaulting to `gpt-oss-120b`.
- `NEXT_PUBLIC_DEMO_MODE`: keep `true` for a reliable presentation without an external provider.

## MVP API

```text
POST /api/projects
POST /api/projects/{id}/discovery
POST /api/projects/{id}/positioning
POST /api/projects/{id}/personality
POST /api/projects/{id}/battle
POST /api/projects/{id}/critic
POST /api/projects/{id}/select-direction
POST /api/projects/{id}/visual
POST /api/projects/{id}/voice
POST /api/projects/{id}/guardian
POST /api/projects/{id}/launch
GET  /api/projects/{id}/brand-kit
GET  /api/projects/{id}
```

## Architecture direction

The intended live orchestration pipeline is:

`Discovery -> Positioning -> Personality -> Brand Battle -> Critic -> Selection -> Visual -> Voice -> Guardian -> Launch -> Brand Kit`

Each stage receives only the relevant structured `BrandState` fields, validates its JSON output with Pydantic, and writes the next state without destroying the prior state. Demo Mode runs the same UI flow with local deterministic data so it remains reliable without an API key.

## Project structure

```text
app/page.tsx              End-to-end MVP UI and demo workflow state
app/globals.css           BrandForge visual system and responsive layout
app/api/projects          Local project API contract
app/api/guardian          Local Guardian API contract
backend/app/main.py       FastAPI MVP entrypoint
backend/app/api            MVP and brand-system route modules
backend/app/agents         Structured fallback/LLM agent functions
backend/app/schemas        Validated BrandState and output models
backend/app/services       LLM and orchestration services
backend/requirements.txt   Backend dependencies
.env.example              Provider configuration template
```

## Hackathon note

Demo Mode is intentionally labeled in the product. Its outputs are deterministic development data, not claimed live model calls. Set `NEXT_PUBLIC_DEMO_MODE=false`, start FastAPI, and configure the provider before presenting live generation.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
