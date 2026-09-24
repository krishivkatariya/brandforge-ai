# BrandForge AI

**Build it. Challenge it. Brand it.**

BrandForge is a structured AI brand strategy studio for turning a rough product idea into a coherent, launch-ready brand system. It is designed to show the reasoning between stages rather than hide everything inside a single prompt.

## What is implemented

- Demo Mode with a complete Campus Relay project and realistic structured outputs.
- Dashboard with persistent project state and workflow progress.
- Transparent workflow view showing inputs, context passed forward, and outputs.
- Brand Battle with three different territories: Builder, Community, and Competition.
- Anti-generic critic evidence and critique-loop status.
- Brand Guardian with a content check, scores, explanation, and revised copy.
- Brand Kit with strategy, personality, visual direction, launch copy, and JSON export.
- Next.js API routes for project creation/listing and Guardian checks.
- FastAPI API shell for a live server-side provider integration.
- Environment-variable configuration with no secrets in frontend code.

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

The current machine's Python 3.6 installation is below FastAPI's supported runtime range. Use Python 3.10+ for the optional backend:

```powershell
cd backend
py -3.11 -m venv .venv
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

## Architecture direction

The intended live orchestration pipeline is:

`Discovery -> Positioning -> Personality -> Brand Battle -> Critic -> Selection -> Visual -> Voice -> Guardian -> Launch`

Each stage should receive only the relevant structured `BrandState` fields, validate its JSON output with Pydantic, and write the next state without destroying the prior state. The demo UI already models this context flow and is safe to run without an API key.

## Project structure

```text
app/page.tsx              Main product UI and demo workflow state
app/globals.css           BrandForge visual system and responsive layout
app/api/projects          Local project API contract
app/api/guardian          Local Guardian API contract
backend/app/main.py       Optional FastAPI server shell
backend/requirements.txt  Optional backend dependencies
.env.example              Provider configuration template
```

## Hackathon note

Demo Mode is intentionally labeled in the product. Its outputs are pre-generated presentation data, not claimed live model calls. Set `NEXT_PUBLIC_DEMO_MODE=false` and configure the backend/provider boundary before presenting live generation.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
