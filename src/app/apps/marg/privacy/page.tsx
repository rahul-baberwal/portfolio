import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Marg | Rahul Baberwal',
  description: 'Privacy policy for Marg — Fake GPS & Route Mocker. No ads, no analytics, no accounts. No real coordinates are transmitted or stored.',
  alternates: { canonical: 'https://rahulbaberwal.com/apps/marg/privacy' },
};

export default function MargPrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 font-sans">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--text3)] mb-8 font-mono">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/apps/marg" className="hover:text-[var(--accent)]">Marg</Link>
        <span className="mx-2">/</span>
        <span>Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Privacy Policy — Marg</h1>
      <p className="text-sm text-[var(--text3)] mb-10">Last updated: 25 November 2026</p>

      <section className="space-y-8 text-[var(--text2)] leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">App and Developer</h2>
          <p>
            <strong>App name:</strong> Marg — Fake GPS &amp; Route Mocker<br />
            <strong>Package:</strong> com.rahulbaberwal.marg<br />
            <strong>Developer:</strong> Rahul Baberwal<br />
            <strong>Contact:</strong>{' '}
            <a href="mailto:im@rahulbaberwal.com" className="underline">im@rahulbaberwal.com</a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Summary</h2>
          <p>
            Marg does <strong>not</strong> collect, store, or transmit any personal data. There are
            no ads, no analytics SDKs, and no account system. Your real GPS coordinates are
            <strong> never</strong> stored on-device or transmitted anywhere.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Data Collected</h2>
          <p>
            Marg collects <strong>no personal data</strong>. Simulated route coordinates exist only
            in memory during an active session and are discarded when the session ends.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Permissions</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Mock Location (developer option):</strong> Required to inject a simulated
              GPS position into the Android system. No real location is read by the app.
            </li>
            <li>
              <strong>Foreground Service / Notifications:</strong> Used to display the live-route
              notification while a simulation is running.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Network Calls</h2>
          <p className="mb-2">
            To function, Marg makes outbound network requests to the following open-data services.
            These are standard map and routing requests; they do not include any personal
            identifiers or real device-GPS coordinates.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>OSRM (router.project-osrm.org):</strong> Route calculation between
              user-defined waypoints. The waypoints are locations you explicitly enter; your device
              GPS is not used.
            </li>
            <li>
              <strong>Map tiles (OpenStreetMap tile servers):</strong> Rendered map imagery. Tile
              requests include the tile coordinates (zoom/x/y) needed to display the map region
              you are viewing.
            </li>
            <li>
              <strong>TODO:</strong> Confirm whether Nominatim, Photon, or another geocoding
              service is called during place-name search, and disclose accordingly.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Third-Party Services</h2>
          <p>
            Marg contains no ads, no crash-reporting SDKs (e.g., Firebase Crashlytics), and no
            analytics libraries. The only outbound connections are those listed under Network Calls
            above.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Children</h2>
          <p>Marg does not knowingly collect data from children under 13.</p>
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
