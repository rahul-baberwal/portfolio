import React from 'react';

interface ToolCard {
  name: string;
  tagline: string;
  techTag: string;
  liveUrl: string;
  repoUrl?: string;
  note?: string; // visible TODO or note shown in UI
}

const tools: ToolCard[] = [
  {
    name: 'IndexPilot',
    tagline:
      'Bulk URL submission to Google Indexing API and Bing IndexNow — multi-profile, sitemap parser, local-first.',
    techTag: 'Web app · runs in your browser',
    liveUrl: 'https://indexpilot.rahulbaberwal.com',
    repoUrl: 'https://github.com/rahul-baberwal/indexpilot',
  },
  {
    name: 'Patra',
    tagline:
      'Convert photos of Aadhaar, PAN, and marksheets to A4 PDFs compressed to exam-portal size limits — no uploads, fully client-side.',
    techTag: 'Web app · runs in your browser',
    liveUrl: 'https://patrapdf.netlify.app',
    note: 'TODO: move to patra.rahulbaberwal.com',
  },
  {
    name: 'Tankan',
    tagline:
      'Free offline typing-test practice for Indian government exams in English and Hindi, with commission-style scoring.',
    techTag: 'Web app · runs in your browser',
    liveUrl: 'https://tankan.rahulbaberwal.com',
  },
];

export default function ToolsSection() {
  return (
    <section id="tools">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-16">
          <div className="section-label">Web Tools</div>
          <h2 className="section-title">Tools I&apos;ve Built</h2>
          <p className="text-lg text-[var(--text2)] max-w-2xl leading-relaxed">
            Small, focused browser tools — no sign-up, no server, no data leaving your device.
            Used by developers and exam aspirants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="group relative flex flex-col justify-between bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-8 hover:border-[var(--accent2)] transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow — accent2 tint to visually distinguish from Apps cards */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent2)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="h-12 w-12 rounded-xl bg-[var(--bg3)] border border-[var(--border)] flex items-center justify-center mb-6">
                  <i className="fa-solid fa-wrench text-xl text-[var(--accent2)]" />
                </div>

                <h3 className="text-xl font-bold font-mono mb-1 group-hover:text-[var(--accent2)] transition-colors">
                  {tool.name}
                </h3>

                <span className="inline-block px-2 py-0.5 rounded bg-[var(--bg3)] border border-[var(--border)] text-xs font-mono text-[var(--text3)] mb-3">
                  {tool.techTag}
                </span>

                <p className="text-[var(--text2)] text-sm leading-relaxed mb-4">{tool.tagline}</p>

                {tool.note && (
                  <p className="text-xs font-mono text-[var(--text3)] mb-2">{tool.note}</p>
                )}
              </div>

              {/* Footer links */}
              <div className="relative z-10 pt-4 border-t border-[var(--border)] flex flex-wrap gap-2 items-center">
                <a
                  href={tool.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent2)] text-white text-xs font-mono hover:opacity-90 transition-opacity"
                  aria-label={`Try ${tool.name}`}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                  Try it
                </a>

                {tool.repoUrl && (
                  <a
                    href={tool.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-xs font-mono text-[var(--text2)] hover:border-[var(--accent2)] transition-colors"
                    aria-label={`${tool.name} GitHub repository`}
                  >
                    <i className="fa-brands fa-github" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
