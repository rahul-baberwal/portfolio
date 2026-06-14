# Prompt: Convert rahulbaberwal.com to Next.js 14 + Supabase + Tailwind

Paste this entire prompt into Antigravity. It is self-contained and covers the full project.

---

## Project Overview

Convert **rahulbaberwal.com** — a personal portfolio for Rahul Baberwal (Python Backend Developer & AI Engineer, IIT Ropar) — from a static single-page site into a **Next.js 14 (App Router) + Supabase + Tailwind CSS** stack, deployed on Netlify.

**Design direction:** Keep the terminal/hacker aesthetic, but make it cleaner, faster, and more polished. Think: VS Code dark theme meets a refined developer portfolio. No clutter. Every pixel intentional.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Database | Supabase (PostgreSQL) |
| Fonts | JetBrains Mono (headings/terminal) + Geist (body) |
| Deployment | Netlify |
| Markdown | `next-mdx-remote` or `marked` for blog body rendering |
| Icons | `lucide-react` |

---

## File & Folder Structure

```
rahulbaberwal.com/
├── app/
│   ├── layout.tsx              # Root layout: metadata, fonts, navbar, footer
│   ├── page.tsx                # Home — hero, about, skills, experience, contact
│   ├── blog/
│   │   ├── page.tsx            # Blog list — SSG, fetches from Supabase at build
│   │   └── [slug]/
│   │       └── page.tsx        # Blog post — SSG + ISR, full HTML rendered server-side
│   └── projects/
│       ├── page.tsx            # Projects grid — SSG
│       └── [slug]/
│           └── page.tsx        # Project detail — SSG, rich case study layout
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── TerminalHero.tsx        # Animated typing effect hero
│   ├── SkillBadge.tsx
│   ├── ProjectCard.tsx
│   ├── BlogCard.tsx
│   └── JsonLd.tsx              # Structured data injector
├── lib/
│   ├── supabase.ts             # Supabase client (server-side)
│   └── types.ts                # TypeScript interfaces
├── public/
│   ├── profile.webp
│   └── og-banner.webp
├── .env.local                  # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
├── netlify.toml
└── next.config.js
```

---

## Supabase Schema

Run these SQL statements in the Supabase SQL editor:

```sql
-- Blog posts
create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  body text not null,          -- Markdown content
  tags text[] default '{}',
  published_at timestamptz default now(),
  updated_at timestamptz default now(),
  published boolean default false
);

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text,
  description text not null,   -- Markdown: full case study
  tech_stack text[] default '{}',
  github_url text,
  live_url text,
  cover_image text,            -- URL or /public path
  featured boolean default false,
  sort_order int default 0
);

-- Enable RLS, allow public read
alter table posts enable row level security;
create policy "Public read" on posts for select using (published = true);

alter table projects enable row level security;
create policy "Public read" on projects for select using (true);
```

---

## Design System

### Color Palette (CSS variables in `globals.css`)

```css
:root {
  --bg:          #0d0d0d;
  --bg-surface:  #141414;
  --bg-card:     #1a1a1a;
  --border:      #2a2a2a;
  --border-glow: #00ff9580;
  --text:        #e8e8e8;
  --text-muted:  #666;
  --text-dim:    #444;
  --accent:      #00ff95;      /* terminal green — primary accent */
  --accent-dim:  #00ff9520;
  --accent2:     #7c6aff;      /* purple — secondary accent */
  --red:         #ff4757;
  --yellow:      #ffd32a;
}
```

### Typography Rules

- **Headings & terminal text:** `font-family: 'JetBrains Mono', monospace`
- **Body & prose:** `font-family: 'Geist', sans-serif`
- **Font sizes:** Use Tailwind's scale. `text-sm` for metadata, `text-base` for body, `text-4xl/5xl` for hero.
- **No font below 12px** anywhere.

### Component Patterns

**Terminal prompt prefix:** Any heading or label that feels "terminal" should be prefixed with a green `>_` or `$ ` span in `--accent`.

**Cards:** Dark card with `bg-card`, `border border-[var(--border)]`, rounded-lg, hover lifts with `hover:border-[var(--accent)]` and a subtle `box-shadow: 0 0 20px var(--accent-dim)` glow.

**Buttons:** Two variants:
- Primary: `bg-accent text-black font-mono font-bold px-5 py-2 rounded hover:opacity-90`
- Ghost: `border border-accent text-accent font-mono px-5 py-2 rounded hover:bg-accent-dim`

**Code blocks in blog posts:** Style with `bg-[#0a0a0a] border border-[var(--border)] rounded-lg p-4 font-mono text-sm`. Syntax highlight with `highlight.js` (dark theme).

---

## Page Specifications

### 1. `app/layout.tsx` — Root Layout

- Load JetBrains Mono and Geist via `next/font/google`
- Set global metadata: `title`, `description`, `openGraph`, `twitter` — pull from site constants
- Inject `JsonLd` component with `Person` schema (see SEO section)
- Include `<Navbar>` and `<Footer>`
- Background: `bg-[#0d0d0d]` on `<body>`, subtle scanline texture via CSS `::before` pseudoelement using `repeating-linear-gradient`

```tsx
// Scanline texture on body
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

### 2. `app/page.tsx` — Home

Sections in order:

**Hero section (`<TerminalHero>`):**
- Full viewport height, centered
- Animated text: types out `> Rahul Baberwal` then on a new line `> Python Backend Developer & AI Engineer`
- Use a simple `useEffect` + `useState` typewriter — no library needed
- Blinking cursor `|` in `--accent` color
- Below the typed text: two CTA buttons — "View Projects →" and "Read Blog →"
- Subtle animated grid background: CSS `background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)` with `background-size: 40px 40px`

**About section:**
- Two-column: left = profile.webp in a card with green border glow, right = bio text
- Include: IIT Ropar M.Tech (AI/ML), MGSU B.Sc, current focus areas
- Terminal-style label: `> about_me.txt`

**Skills section:**
- Group by category: Languages, Backend, AI/ML, DevOps, Databases
- Each skill = `<SkillBadge>`: small pill with icon (use text/emoji if no icon), `bg-accent-dim border border-accent/30 text-accent font-mono text-xs px-3 py-1 rounded-full`
- Category header prefixed with `//` comment style in `--text-muted`

**Experience section:**
- Vertical timeline using a left border `border-l-2 border-[var(--border)]` with dot markers in `--accent`
- Each entry: role, company, dates, 2–3 bullet points
- Include: IIT Ropar research, any internships

**Contact section:**
- Simple centered block
- Email, GitHub, LinkedIn, About.me links as icon + text rows
- One large ghost CTA: `> send_message` that links to mailto

### 3. `app/blog/page.tsx` — Blog List

```tsx
// Data fetching — runs at build time (SSG)
export const revalidate = 3600; // ISR: rebuild every hour

async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('slug, title, description, tags, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false });
  return data ?? [];
}
```

- Page header: `> /blog` in terminal style, post count shown as `// 3 posts`
- Grid of `<BlogCard>` components: title, description, tags as pills, date, "Read →" link
- Tag filter bar at top: clicking a tag filters the list (client component)
- Empty state: terminal-style `> no posts found matching [tag]`

### 4. `app/blog/[slug]/page.tsx` — Blog Post

```tsx
export async function generateStaticParams() {
  const { data } = await supabase.from('posts').select('slug').eq('published', true);
  return (data ?? []).map(p => ({ slug: p.slug }));
}

export const revalidate = 3600;
```

- Full-width prose layout, max-width `prose-lg`, centered
- Header: title (JetBrains Mono, large), tags, date, read-time estimate
- Body: render markdown with `marked` or `next-mdx-remote`
- Apply Tailwind `prose` plugin with dark mode overrides for terminal feel
- Code blocks: syntax highlighted with `highlight.js`
- Inject per-post JSON-LD `Article` schema with `title`, `description`, `datePublished`, `author`
- Footer: "← Back to Blog" link + "Share on Twitter/LinkedIn" buttons
- Dynamic `generateMetadata()` for per-post `<title>` and `<meta description>`

### 5. `app/projects/page.tsx` — Projects Grid

```tsx
export const revalidate = 3600;

async function getProjects() {
  const { data } = await supabase
    .from('projects')
    .select('slug, title, tagline, tech_stack, cover_image, featured')
    .order('sort_order');
  return data ?? [];
}
```

- Featured project at top: larger card, full-width, with cover image
- Below: 2-column grid of regular project cards
- Each card: title, tagline, tech stack badges, "View Case Study →" and GitHub icon links
- Filter by tech stack tag (client component)

### 6. `app/projects/[slug]/page.tsx` — Project Detail

```tsx
export async function generateStaticParams() {
  const { data } = await supabase.from('projects').select('slug');
  return (data ?? []).map(p => ({ slug: p.slug }));
}
```

Layout:
- Hero: project title (large, JetBrains Mono), tagline, tech stack badges, GitHub + Live links
- Cover image full-width with rounded corners
- Body: render `description` markdown — this is the full case study
- Sidebar (sticky on desktop): tech stack list, links, back to projects
- `generateMetadata()` for unique title + description per project

---

## SEO Implementation

### `components/JsonLd.tsx`

```tsx
export function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rahul Baberwal",
    "url": "https://rahulbaberwal.com",
    "jobTitle": "Python Backend Developer & AI Engineer",
    "alumniOf": [
      { "@type": "CollegeOrUniversity", "name": "IIT Ropar" },
      { "@type": "CollegeOrUniversity", "name": "MGSU" }
    ],
    "sameAs": [
      "https://github.com/rahulbaberwal",
      "https://linkedin.com/in/rahulbaberwal",
      "https://about.me/rahulbaberwal"
    ],
    "knowsAbout": ["Python", "Django", "FastAPI", "Machine Learning", "AI Engineering"]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
```

Inject in `app/layout.tsx` inside `<head>`.

### `app/sitemap.ts`

```tsx
export default async function sitemap() {
  const { data: posts } = await supabase.from('posts').select('slug, updated_at').eq('published', true);
  const { data: projects } = await supabase.from('projects').select('slug');

  const postUrls = (posts ?? []).map(p => ({
    url: `https://rahulbaberwal.com/blog/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const projectUrls = (projects ?? []).map(p => ({
    url: `https://rahulbaberwal.com/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: 'https://rahulbaberwal.com', priority: 1.0, changeFrequency: 'monthly' as const },
    { url: 'https://rahulbaberwal.com/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: 'https://rahulbaberwal.com/projects', priority: 0.9, changeFrequency: 'monthly' as const },
    ...postUrls,
    ...projectUrls,
  ];
}
```

### `generateMetadata()` pattern for every dynamic page

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: `${post.title} | Rahul Baberwal`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://rahulbaberwal.com/blog/${post.slug}`,
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  };
}
```

---

## Netlify Config (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "your-url"
  NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-anon-key"
```

---

## UX & Animation Details

1. **Page transitions:** Fade-in on route change using `opacity-0 animate-fadeIn` Tailwind keyframe.
2. **Navbar:** Transparent on scroll top, `bg-[#0d0d0d]/90 backdrop-blur border-b border-[var(--border)]` when scrolled. Active link gets `text-accent` color.
3. **Cursor glow:** On desktop, a subtle radial gradient follows the cursor — `rgba(0,255,149,0.04)` — implemented with `mousemove` listener updating a CSS custom property.
4. **Blog post read progress:** Thin `--accent` colored bar at top of page showing scroll progress.
5. **Project card hover:** `transform: translateY(-4px)` + green border glow.
6. **Code blocks:** Include a copy-to-clipboard button (top-right corner of every code block).
7. **Mobile:** Hamburger menu, all grids collapse to single column, hero text scales down.

---

## Environment Variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_SITE_URL=https://rahulbaberwal.com
```

---

## Seed Data for Supabase

Insert these to test immediately:

```sql
insert into posts (slug, title, description, body, tags, published) values
('django-celery-redis', 'Django + Celery + Redis: Production Guide', 'A complete guide to async task processing in Django using Celery and Redis.', '## Introduction\n\nIn production Django apps...', '{"Django","Celery","Redis","Backend"}', true),
('fastapi-vs-django-rest', 'FastAPI vs Django REST Framework in 2025', 'An honest comparison for Python backend developers.', '## Overview\n\nBoth frameworks...', '{"FastAPI","Django","Python","Backend"}', true);

insert into projects (slug, title, tagline, description, tech_stack, github_url, featured, sort_order) values
('easyspinlaundry', 'EasySpin Laundry', 'On-demand laundry service platform', '## Problem\n\nStudents at IIT Ropar needed...', '{"Django","React","PostgreSQL","Redis"}', 'https://github.com/rahulbaberwal/easyspinlaundry', true, 1),
('movie-explorer', 'Movie Explorer', 'AI-powered movie recommendation engine', '## What it does\n\n...', '{"Python","FastAPI","ML","TMDB API"}', 'https://github.com/rahulbaberwal/movie-explorer', false, 2);
```

---

## Build Order for Antigravity

Tell Antigravity to build in this sequence to avoid import errors:

1. `lib/supabase.ts` and `lib/types.ts`
2. `components/JsonLd.tsx`, `SkillBadge.tsx`, `ProjectCard.tsx`, `BlogCard.tsx`
3. `components/TerminalHero.tsx`, `Navbar.tsx`, `Footer.tsx`
4. `app/layout.tsx`
5. `app/page.tsx`
6. `app/blog/page.tsx` → `app/blog/[slug]/page.tsx`
7. `app/projects/page.tsx` → `app/projects/[slug]/page.tsx`
8. `app/sitemap.ts`
9. `netlify.toml`, `next.config.js`

---

## What NOT to do

- Do not use `pages/` router — use App Router only
- Do not use `getServerSideProps` — use server components with `async/await`
- Do not hardcode blog/project content — everything comes from Supabase
- Do not use client components unless interactivity is needed (tag filters, typewriter, navbar scroll)
- Do not use `localStorage` for anything
- Do not install a heavy CMS — Supabase dashboard is the admin panel
