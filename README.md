# ClipSavvy

A modern alternative frontend for viewing and managing your Readwise highlights.

## Features

- **Source Organization** — View highlights grouped by books, articles, tweets, podcasts, and supplementals
- **Category Filtering** — Filter sources by type to focus on what matters
- **Full-Text Search** — Search across all your highlights and notes instantly
- **Source Details** — Click any source to see all its highlights with notes, tags, and location info
- **Dark Mode** — Automatic dark/light theme based on system preference
- **Vercel Ready** — Deploy with one click

## Getting Started

### Prerequisites

- Node.js 18+
- A Readwise account with API access

### Get Your API Token

1. Go to [readwise.io/access_token](https://readwise.io/access_token)
2. Copy your access token

### Installation

```bash
git clone https://github.com/yourusername/clipsavvy.git
cd clipsavvy
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your Readwise API token.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/clipsavvy)

No environment variables required — the API token is stored in your browser's localStorage.

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Main entry (login or dashboard)
│   └── sources/[id]/page.tsx    # Source detail page
├── components/
│   ├── Dashboard.tsx            # Source grid and search results
│   ├── Header.tsx               # Search bar and navigation
│   ├── Sidebar.tsx              # Category filters
│   ├── SourceCard.tsx           # Book/article card
│   ├── HighlightCard.tsx        # Individual highlight
│   └── LoginForm.tsx            # API token input
├── lib/
│   ├── readwise.ts              # Readwise API client
│   ├── context.tsx              # React context for state
│   └── storage.ts               # Token persistence
└── types/
    └── readwise.ts              # TypeScript interfaces
```

## License

MIT
