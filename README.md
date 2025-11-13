# HQ

A personal dashboard and management system built with Next.js 14, TypeScript, and TailwindCSS.

## Features

- **Dashboard**: Personal command center
- **Todos**: Task and project management
- **Bills & Due Dates**: Track bills and important deadlines
- **Business**: Business management and operations

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- React 18

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically redirect to the dashboard.

## Project Structure

```
app/
├── layout.tsx          # Root layout with navigation
├── page.tsx            # Home page (redirects to dashboard)
├── globals.css         # Global styles and Tailwind directives
├── dashboard/          # Dashboard page
├── todos/              # Todos page
├── bills/              # Bills & Due Dates page
└── business/           # Business page

components/
├── Navigation.tsx      # Navigation bar component
└── PageHeader.tsx      # Reusable page header component

lib/
├── supabase/
│   └── client.ts       # Supabase client configuration
└── data/
    ├── todos.ts        # Todo data helpers
    ├── bills.ts        # Bill data helpers
    └── teagueJobs.ts   # Teague job data helpers

types/
└── db.ts               # TypeScript types for database tables
```

## Styling

- Background: `bg-zinc-100`
- Cards: `bg-white rounded-xl shadow-sm`
- Active links: `text-indigo-600`
- All pages use consistent spacing and styling
