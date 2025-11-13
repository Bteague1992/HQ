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

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
└── business/           # business page

components/
├── Navigation.tsx      # Navigation bar component
└── PageHeader.tsx      # Reusable page header component
```

## Styling

- Background: `bg-zinc-100`
- Cards: `bg-white rounded-xl shadow-sm`
- Active links: `text-indigo-600`
- All pages use consistent spacing and styling
