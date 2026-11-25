import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Black Tile | Rahul Baberwal',
  description: 'Privacy policy for Black Tile — Software Privacy Display. No INTERNET permission, local-only storage via SharedPreferences. No data leaves your device.',
  alternates: { canonical: 'https://rahulbaberwal.com/apps/black-tile/privacy' },
};

export default function BlackTilePrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 font-sans">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--text3)] mb-8 font-mono">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/apps/black-tile" className="hover:text-[var(--accent)]">Black Tile</Link>
        <span className="mx-2">/</span>
        <span>Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Privacy Policy — Black Tile</h1>
      <p className="text-sm text-[var(--text3)] mb-10">Last updated: 25 November 2026</p>

      <section className="space-y-8 text-[var(--text2)] leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">App and Developer</h2>
          <p>
            <strong>App name:</strong> Black Tile — Software Privacy Display<br />
            <strong>Developer:</strong> Rahul Baberwal<br />
            <strong>Contact:</strong>{' '}
            <a href="mailto:im@rahulbaberwal.com" className="underline">im@rahulbaberwal.com</a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Summary</h2>
          <p>
            Black Tile collects <strong>no personal data whatsoever</strong>. The app has no
            INTERNET permission — it is <strong>physically incapable</strong> of sending data over
            a network. All settings are stored locally on your device using Android
            SharedPreferences and are never shared.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Data Collected</h2>
          <p>
            None. Black Tile stores only your tile appearance and position preferences locally via
            SharedPreferences. This data never leaves your device.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Permissions</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>SYSTEM_ALERT_WINDOW (Draw over other apps):</strong> Required to display
              overlay tiles on top of any application. Without this permission the app cannot
              function. It is used solely to render your chosen tiles; no screen content is read
              or recorded.
            </li>
          </ul>
          <p className="mt-3">
            Black Tile does <strong>not</strong> request INTERNET, CAMERA, MICROPHONE, LOCATION,
            READ_CONTACTS, or any other sensitive permissions.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Third-Party Services</h2>
          <p>
            None. Black Tile contains no ads, no analytics, no crash-reporting SDKs, and no
            third-party libraries of any kind.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Children</h2>
          <p>Black Tile does not knowingly collect data from children under 13.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Contact</h2>
          <p>
            Questions about this policy?{' '}
            <a href="mailto:im@rahulbaberwal.com" className="underline">im@rahulbaberwal.com</a>
          </p>
        </div>
      </section>
    </main>
  );
}
