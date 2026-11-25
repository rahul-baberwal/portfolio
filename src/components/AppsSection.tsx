import React from 'react';
import Link from 'next/link';

interface AppCard {
  slug: string;
  name: string;
  tagline: string;
  tags: string[];
  storeUrl?: string;
  storeLabel?: string;
  docsUrl: string;
  repoUrl: string;
}

const apps: AppCard[] = [
  {
    slug: 'marg',
    name: 'Marg',
    tagline: 'Native Android mock-GPS tool for developers and QA testers.',
    tags: ['Kotlin', 'Jetpack Compose', 'MapLibre', 'OSRM', 'OpenStreetMap'],
    storeUrl: 'https://indusapp.store/3y8hrlz0',
    storeLabel: 'Indus Appstore',
    docsUrl: 'https://rahul-baberwal.github.io/marg',
    repoUrl: 'https://github.com/rahul-baberwal/marg',
  },
  {
    slug: 'black-tile',
    name: 'Black Tile',
    tagline: 'Movable, resizable overlay tiles that hide screen areas from shoulder surfers.',
    tags: ['Kotlin', 'Android SDK', 'No third-party libs', 'No INTERNET permission'],
    docsUrl: 'https://rahul-baberwal.github.io/Black-Tile-Privacy-Shield',
    repoUrl: 'https://github.com/rahul-baberwal/Black-Tile-Privacy-Shield',
  },
  {
    slug: 'wattwarden',
    name: 'WattWarden',
    tagline: 'Live wattage, battery-health estimates, charge-limit alarms and smart-plug webhooks.',
    tags: ['Kotlin', 'Jetpack Compose', 'Room', 'WorkManager', 'Glance Widget'],
    docsUrl: 'https://rahul-baberwal.github.io/WattWarden',
    repoUrl: 'https://github.com/rahul-baberwal/WattWarden',
  },
];

export default function AppsSection() {
  return (
    <section id="apps">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-16">
          <div className="section-label">Android</div>
          <h2 className="section-title">Apps I&apos;ve Shipped</h2>
          <p className="text-lg text-[var(--text2)] max-w-2xl leading-relaxed">
            Three published Android apps, each solving a real developer or user problem.
            Kotlin · Jetpack Compose · No ads, no trackers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div
              key={app.slug}
              className="group relative flex flex-col justify-between bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-8 hover:border-[var(--accent)] transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* TODO: replace with real app icon once available */}
                <div className="h-14 w-14 rounded-xl bg-[var(--bg3)] border border-[var(--border)] flex items-center justify-center mb-6">
                  <i className="fa-brands fa-android text-2xl text-[var(--accent)]" />
                </div>

                <h3 className="text-xl font-bold font-mono mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {app.name}
                </h3>
                <p className="text-[var(--text2)] text-sm leading-relaxed mb-4">{app.tagline}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 rounded bg-[var(--bg3)] border border-[var(--border)] text-xs font-mono text-[var(--text2)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer links */}
              <div className="relative z-10 pt-4 border-t border-[var(--border)] flex flex-wrap gap-2 items-center">
                <Link
                  href={`/apps/${app.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-mono hover:opacity-90 transition-opacity"
                >
                  <i className="fa-solid fa-circle-info" />
                  Details
                </Link>

                {app.storeUrl && (
                  <a
                    href={app.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-xs font-mono text-[var(--text2)] hover:border-[var(--accent)] transition-colors"
                    aria-label={`${app.name} on ${app.storeLabel}`}
                  >
                    <i className="fa-solid fa-download" />
                    {app.storeLabel ?? 'Store'}
                  </a>
                )}

                <a
                  href={app.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-xs font-mono text-[var(--text2)] hover:border-[var(--accent2)] transition-colors"
                  aria-label={`${app.name} documentation`}
                >
                  <i className="fa-solid fa-book" />
                  Docs
                </a>

                <a
                  href={app.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-xs font-mono text-[var(--text2)] hover:border-[var(--accent)] transition-colors"
                  aria-label={`${app.name} GitHub repository`}
                >
                  <i className="fa-brands fa-github" />
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
