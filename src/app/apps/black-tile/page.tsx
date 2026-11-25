import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Black Tile — Software Privacy Display | Rahul Baberwal',
  description:
    'Black Tile adds movable, resizable black overlay tiles to hide screen areas from shoulder surfers. 6 styles, Quick Settings tile, widget, no INTERNET permission.',
  alternates: { canonical: 'https://rahulbaberwal.com/apps/black-tile' },
};

const features = [
  'Movable and resizable black overlay tiles that cover any screen area',
  'Lock mode with touch passthrough — tiles stay on-screen but taps reach apps beneath',
  '6 overlay styles to suit different use cases',
  'Quick Settings tile for one-tap toggle',
  'Home-screen widget for fast access',
  'Pure Kotlin on the Android SDK — zero third-party libraries',
  'No INTERNET permission · No trackers · Local-only storage via SharedPreferences',
  'v1.1.3',
];

const techStack = ['Kotlin', 'Android SDK', 'SharedPreferences', 'Quick Settings API', 'App Widgets'];

export default function BlackTilePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--text3)] mb-8 font-mono">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/#apps" className="hover:text-[var(--accent)]">Apps</Link>
        <span className="mx-2">/</span>
        <span>Black Tile</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        {/* TODO: [screenshot/icon] replace placeholder with real icon */}
        <div className="h-20 w-20 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-center mb-6">
          <i className="fa-solid fa-shield-halved text-4xl text-[var(--accent)]" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Black Tile — Software Privacy Display</h1>
        <p className="text-xl text-[var(--text2)] mb-6">
          Movable, resizable black overlay tiles that hide screen areas from shoulder surfers.
          Lock mode, 6 overlay styles, Quick Settings tile, home-screen widget — all with
          no INTERNET permission and no third-party libraries.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://rahul-baberwal.github.io/Black-Tile-Privacy-Shield"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--accent2)] transition-colors"
          >
            <i className="fa-solid fa-book" />
            Docs
          </a>
          <a
            href="https://github.com/rahul-baberwal/Black-Tile-Privacy-Shield"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--accent)] transition-colors"
          >
            <i className="fa-brands fa-github" />
            GitHub
          </a>
          <Link
            href="/apps/black-tile/privacy"
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
        TODO: [screenshot/icon] Add Black Tile app screenshots here once available.
      </div>
    </main>
  );
}
