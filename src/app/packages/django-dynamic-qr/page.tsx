import type { Metadata } from 'next';
import Link from 'next/link';
import CopyInstallButton from '../../../components/CopyInstallButton';

export const metadata: Metadata = {
  title: 'django-dynamic-qr | Dynamic QR Code Package for Django',
  description:
    'Self-hosted Django QR code generator with dynamic QR codes, 14 types, scan analytics, access control, bulk export, and REST API.',
  keywords: [
    'Django QR code generator',
    'dynamic QR code',
    'self-hosted QR',
    'QR analytics',
    'django-dynamic-qr',
    'Django',
  ],
  alternates: { canonical: 'https://rahulbaberwal.com/packages/django-dynamic-qr' },
  openGraph: {
    type: 'website',
    url: 'https://rahulbaberwal.com/packages/django-dynamic-qr',
    title: 'django-dynamic-qr | Dynamic QR Code Package for Django',
    description:
      'Self-hosted dynamic QR codes for Django: 14 QR types, editable short URLs, QR analytics, access control, bulk export and REST API.',
  },
};

const featureGroups = [
  {
    title: 'QR Types',
    items: [
      '14 QR types: URL, vCard, vCard+ (rich landing page), PDF, Restaurant Menu, Social Links hub, WiFi, Email, SMS, WhatsApp, Image Gallery, Plain Text, Link List, and App Store (smart iOS/Android redirect)',
      'Dynamic short URLs: edit the destination after printing with no reprint needed',
    ],
  },
  {
    title: 'Design & Export',
    items: [
      'Design engine with custom colors, logo overlay, frame styles, and 4 error-correction levels',
      'Export to PNG, SVG, PDF, and EPS',
    ],
  },
  {
    title: 'Analytics',
    items: [
      'QR analytics: scan count, device/OS/browser, country/city, daily trend, and CSV/XLSX export',
    ],
  },
  {
    title: 'Access Control',
    items: [
      'Password protection, daily scan limits, scheduled activation/expiry, and country allow-list',
    ],
  },
  {
    title: 'Bulk & API',
    items: [
      'Bulk CSV import and ZIP export',
      'REST API via Django REST Framework viewsets with optional token auth',
    ],
  },
  {
    title: 'Admin & Async',
    items: [
      'Django admin with inline scan logs, live QR preview, and bulk actions',
      'Optional Celery task for non-blocking scan logging',
    ],
  },
];

const techStack = ['Python', 'Django', 'Django REST Framework', 'Celery (optional)'];

export default function DjangoDynamicQrPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'django-dynamic-qr',
    description:
      'Self-hosted Django QR code generator for dynamic QR codes, scan analytics, access control, bulk export, and REST API.',
    programmingLanguage: 'Python',
    codeRepository: 'https://github.com/rahul-baberwal/django-dynamic-qr',
    url: 'https://rahulbaberwal.com/packages/django-dynamic-qr',
    version: '1.0.0',
    author: {
      '@type': 'Person',
      name: 'Rahul Baberwal',
      url: 'https://rahulbaberwal.com',
    },
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--text3)] mb-8 font-mono">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/#packages" className="hover:text-[var(--accent)]">Packages</Link>
        <span className="mx-2">/</span>
        <span>django-dynamic-qr</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        {/* TODO: [package image/screenshot] replace placeholder icon */}
        <div className="h-20 w-20 rounded-2xl bg-[var(--bg2)] border border-[var(--border)] flex items-center justify-center mb-6">
          <i className="fa-solid fa-qrcode text-4xl text-[var(--accent)]" />
        </div>

        <h1 className="text-4xl font-bold font-mono mb-3">django-dynamic-qr</h1>
        <p className="text-xl text-[var(--text2)] mb-6">
          Self-hosted dynamic QR codes for Django, a QRFY-style platform you fully own.
        </p>

        <CopyInstallButton command="pip install django-dynamic-qr" />

        <div className="flex flex-wrap gap-3">
          <a
            href="https://pypi.org/project/django-dynamic-qr/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-mono text-sm hover:opacity-90 transition-opacity"
          >
            <i className="fa-brands fa-python" />
            PyPI (v1.0.0)
          </a>
          <a
            href="https://github.com/rahul-baberwal/django-dynamic-qr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--accent)] transition-colors"
          >
            <i className="fa-brands fa-github" />
            GitHub
          </a>
          <a
            href="https://rahul-baberwal.github.io/django-dynamic-qr/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--accent2)] transition-colors"
          >
            <i className="fa-solid fa-book" />
            Docs
          </a>
          <Link
            href="/#packages"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm hover:border-[var(--text3)] transition-colors"
          >
            <i className="fa-solid fa-arrow-left" />
            Back to Packages
          </Link>
        </div>
      </div>

      {/* Why it exists */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">Why it exists</h2>
        <p className="text-[var(--text2)] leading-relaxed">
          Most dynamic QR code platforms lock editable short URLs, QR analytics, and bulk exports
          behind recurring SaaS subscriptions. <code className="font-mono">django-dynamic-qr</code>{' '}
          gives Django teams a self-hosted QR code generator where your links, scan data, and
          branding stay in your own database and infrastructure.
        </p>
      </section>

      {/* Grouped Features */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureGroups.map((group) => (
            <div
              key={group.title}
              className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold font-mono mb-3 text-[var(--accent)]">
                {group.title}
              </h3>
              <ul className="space-y-2 text-sm text-[var(--text2)]">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <i className="fa-solid fa-circle-check text-[var(--accent)] mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Quick-Start */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-3">Quick Start</h2>
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-[var(--text3)] font-mono text-sm">
          TODO: Add quick-start snippet (INSTALLED_APPS, urls include, migrate).
        </div>
      </section>

      {/* Stack */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Stack</h2>
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

      {/* Visible TODOs for missing metadata */}
      <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-[var(--text3)] font-mono text-xs space-y-1">
        <p>TODO: Add package image/screenshot.</p>
        <p>TODO: Add Django Packages link, license, PyPI download count, and live demo link (if one exists).</p>
      </div>
    </main>
  );
}
