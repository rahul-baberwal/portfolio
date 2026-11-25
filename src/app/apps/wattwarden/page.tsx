import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'WattWarden — Battery & Charging Guardian | Rahul Baberwal',
  description:
    'WattWarden shows live wattage, tests chargers, estimates battery health, fires charge-limit and thermal alarms, detects phantom drain, and supports optional smart-plug webhooks.',
  alternates: { canonical: 'https://rahulbaberwal.com/apps/wattwarden' },
};

const features = [
  'Live wattage display (charging power in watts, real-time)',
  'Charger tester — identify charger speed and quality',
  'Battery-health estimate based on charge cycles and capacity delta',
  'Charge-limit alarm — alerts when battery reaches your set threshold',
  'Thermal alarm — warns on abnormal battery temperature',
  'Phantom-drain detection — identifies apps consuming power in background',
  'Optional smart-plug webhooks (Home Assistant / IFTTT) — sends battery data to user-configured URLs',
  'Glance widget for at-a-glance battery stats on the home screen',
  'GPL-3.0 open source',
];

const techStack = ['Kotlin', 'Jetpack Compose', 'Room', 'DataStore', 'WorkManager', 'Glance Widget', 'Webhook/HTTP'];

export default function WattWardenPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--text3)] mb-8 font-mono">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/#apps" className="hover:text-[var(--accent)]">Apps</Link>
        <span className="mx-2">/</span>
        <span>WattWarden</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        {/* TODO: [screenshot/icon] replace placeholder with real icon */}
        <div className="h-20 w-20 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-center mb-6">
          <i className="fa-solid fa-bolt text-4xl text-[var(--accent)]" />
        </div>
        <h1 className="text-4xl font-bold mb-3">WattWarden — Battery &amp; Charging Guardian</h1>
        <p className="text-xl text-[var(--text2)] mb-6">
          Live wattage, charger testing, battery-health estimates, charge-limit and thermal alarms,
          phantom-drain detection, and optional smart-plug webhooks for Home Assistant and IFTTT.
          GPL-3.0.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://rahul-baberwal.github.io/WattWarden"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--accent2)] transition-colors"
          >
            <i className="fa-solid fa-book" />
            Docs
          </a>
          <a
            href="https://github.com/rahul-baberwal/WattWarden"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--accent)] transition-colors"
          >
            <i className="fa-brands fa-github" />
            GitHub
          </a>
          <Link
            href="/apps/wattwarden/privacy"
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
        TODO: [screenshot/icon] Add WattWarden app screenshots here once available.
      </div>
    </main>
  );
}
