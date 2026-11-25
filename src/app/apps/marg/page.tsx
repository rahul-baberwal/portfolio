import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Marg — Fake GPS & Route Mocker | Rahul Baberwal',
  description:
    'Marg is a native Android mock-GPS tool for developers and QA testers. 5 simulation modes, multi-stop route planner, Kotlin, Jetpack Compose, MapLibre, OSRM.',
  alternates: { canonical: 'https://rahulbaberwal.com/apps/marg' },
};

const features = [
  '5 simulation modes: Drive, Walk, Cycle, Train, Fixed',
  'Multi-stop route planner with live navigation notifications',
  'MapLibre for vector maps · OSRM for open routing · OpenStreetMap data',
  'No ads, no analytics, no account required',
  'Material 3 design — Kotlin, Jetpack Compose',
  'Package: com.rahulbaberwal.marg · v2.0.0',
];

const techStack = ['Kotlin', 'Jetpack Compose', 'Material 3', 'MapLibre', 'OSRM', 'OpenStreetMap'];

export default function MargPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--text3)] mb-8 font-mono">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/#apps" className="hover:text-[var(--accent)]">Apps</Link>
        <span className="mx-2">/</span>
        <span>Marg</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        {/* TODO: add app icon once available — replace placeholder below */}
        <div className="h-20 w-20 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-center mb-6">
          <i className="fa-brands fa-android text-4xl text-[var(--accent)]" />
          {/* TODO: [screenshot/icon] replace with <img src="/apps/marg-icon.webp" alt="Marg app icon" width={80} height={80} /> */}
        </div>
        <h1 className="text-4xl font-bold mb-3">Marg — Fake GPS &amp; Route Mocker</h1>
        <p className="text-xl text-[var(--text2)] mb-6">
          Native Android mock-GPS tool for developers and QA testers. Simulate device location
          across 5 modes with a multi-stop planner and live route notifications — no account
          required.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://indusapp.store/3y8hrlz0"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-mono text-sm hover:opacity-90 transition-opacity"
          >
            <i className="fa-solid fa-download" />
            Indus Appstore
          </a>
          <a
            href="https://rahul-baberwal.github.io/marg"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--accent2)] transition-colors"
          >
            <i className="fa-solid fa-book" />
            Docs
          </a>
          <a
            href="https://github.com/rahul-baberwal/marg"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--accent)] transition-colors"
          >
            <i className="fa-brands fa-github" />
            GitHub
          </a>
          <Link
            href="/apps/marg/privacy"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--text3)] transition-colors"
          >
            <i className="fa-solid fa-shield-halved" />
            Privacy
          </Link>
        </div>
      </div>

      {/* Key Features */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[var(--text2)]">
              <i className="fa-solid fa-circle-check text-[var(--accent)] mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* Tech Stack */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((t) => (
            <span
              key={t}
              className="inline-block px-3 py-1 rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-sm font-mono text-[var(--text2)]"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* TODO: Add screenshots once available */}
      <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--text3)] font-mono text-sm">
        TODO: [screenshot/icon] Add Marg app screenshots here once available.
      </div>
    </main>
  );
}
