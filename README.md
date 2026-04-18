# Sydney Pua Ng — AI Portfolio

Interactive AI-powered portfolio. Visitors chat directly with an AI avatar that knows everything about Sydney's work, skills, and projects.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **Vercel AI SDK** — streaming chat
- **Groq** (Llama-3.1-70B) · OpenAI GPT-4o-mini fallback
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
  Avatar.tsx          Animated SVG avatar (idle / thinking / talking)
  ChatMessages.tsx    Message list with markdown + project card injection
  ProjectCards.tsx    3 project cards rendered inline in chat
  SuggestionChips.tsx Quick-start suggestion buttons
  MouseEffect.tsx     Rainbow gradient trail + click splash (canvas)
  ThemeToggle.tsx     Dark/light mode switcher
lib/
  prompt.ts           Full system prompt with Sydney's complete resume
```

## Customization

### Add real project screenshots
Replace `picsum.photos` URLs in [components/ProjectCards.tsx](components/ProjectCards.tsx):
```tsx
image: '/projects/content-automation.png',  // add to /public/projects/
```

### Add your Calendly link
In [lib/prompt.ts](lib/prompt.ts), replace:
```
Book a free 30-min strategy call: [Add your Calendly/Cal.com link here]
```

### Change AI model
In [app/api/chat/route.ts](app/api/chat/route.ts):
```ts
model: groq('llama-3.3-70b-versatile'),  // or any Groq model
```

## Deploy to Vercel

```bash
# Push to GitHub, then:
vercel deploy

# Add environment variable in Vercel dashboard:
# GROQ_API_KEY = gsk_...
```

Or one-click: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Deploy to Render

```bash
# Build command: npm run build
# Start command: npm run start
# Environment: GROQ_API_KEY=gsk_...
```
