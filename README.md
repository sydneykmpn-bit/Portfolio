# Sydney Pua Ng — AI Portfolio

Interactive AI-powered portfolio. Visitors chat directly with an AI avatar that knows everything about Sydney's work, skills, and projects.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **Vercel AI SDK** — streaming chat
- **Groq** (Llama-3.3-70B) · OpenAI GPT-4o-mini fallback
- **Framer Motion** — avatar animations, UI transitions
- **next-themes** — dark / light mode

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your API key
cp .env.example .env.local
# Edit .env.local → add GROQ_API_KEY (get one free at console.groq.com)

# 3. Run
npm run dev
# → http://localhost:3000
```

## Project Structure

```
app/
  layout.tsx          Root layout, Geist font, ThemeProvider
  page.tsx            Main page — chat + avatar orchestration
  globals.css         Tailwind v4 + CSS variables (dark/light)
  api/chat/route.ts   Streaming AI handler (Groq / OpenAI)
components/
  Avatar.tsx          Canvas avatar with mouse-tracking frame animation
  ChatMessages.tsx    Message list with markdown + project card injection
  ProjectCards.tsx    3 project cards rendered inline in chat
  SuggestionChips.tsx Quick-start suggestion buttons
  MouseEffect.tsx     Rainbow gradient trail + click splash (canvas)
  ThemeToggle.tsx     Dark/light mode switcher
lib/
  prompt.ts           Full system prompt with Sydney's complete resume
```

## Deploy to Vercel

```bash
# Push to GitHub, then import at vercel.com
# Add GROQ_API_KEY in Vercel → Settings → Environment Variables
```
