import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — WattWarden | Rahul Baberwal',
  description: 'Privacy policy for WattWarden — Battery & Charging Guardian. Local Room storage, optional webhook for battery data to user-configured URLs.',
  alternates: { canonical: 'https://rahulbaberwal.com/apps/wattwarden/privacy' },
};

export default function WattWardenPrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 font-sans">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--text3)] mb-8 font-mono">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/apps/wattwarden" className="hover:text-[var(--accent)]">WattWarden</Link>
        <span className="mx-2">/</span>
        <span>Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">Privacy Policy — WattWarden</h1>
      <p className="text-sm text-[var(--text3)] mb-10">Last updated: 25 November 2026</p>

      <section className="space-y-8 text-[var(--text2)] leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">App and Developer</h2>
          <p>
            <strong>App name:</strong> WattWarden — Battery &amp; Charging Guardian<br />
            <strong>License:</strong> GPL-3.0<br />
            <strong>Developer:</strong> Rahul Baberwal<br />
            <strong>Contact:</strong>{' '}
            <a href="mailto:im@rahulbaberwal.com" className="underline">im@rahulbaberwal.com</a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Summary</h2>
          <p>
            WattWarden stores battery history locally on your device. It does <strong>not</strong>{' '}
            share data with any third-party service unless you explicitly configure a webhook URL
            (e.g., Home Assistant or IFTTT). If you configure a webhook, battery level and
            temperature data will be sent to the URL you provide.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Data Collected &amp; Stored Locally</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Battery level (percentage) over time — stored in a local Room database</li>
            <li>Battery temperature — stored in a local Room database</li>
            <li>User preferences (charge-limit threshold, thermal alarm setting) — stored in DataStore</li>
          </ul>
          <p className="mt-3">
            All data above remains on your device and is <strong>not</strong> transmitted anywhere
            by default.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Optional Webhook (Smart Plug Integration)</h2>
          <p>
            If you enable the smart-plug webhook feature and provide a URL (e.g., your Home
            Assistant or IFTTT endpoint), WattWarden will POST the following data to that URL
            when triggered:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Battery level (percentage)</li>
            <li>Battery temperature</li>
          </ul>
          <p className="mt-3">
            The webhook URL is set entirely by you and is stored locally. No data is sent to the
            developer or any service operated by the developer. You are responsible for the
            privacy practices of the endpoint you configure.
          </p>
          <p className="mt-2 font-mono text-sm bg-[var(--bg2)] border border-[var(--border)] rounded p-3">
            TODO: Confirm the exact payload fields, triggering conditions (threshold crossed vs.
            periodic), and whether HTTP or HTTPS is enforced, then update this section.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Permissions</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>POST_NOTIFICATIONS:</strong> Used to deliver charge-limit and thermal alarm
              notifications to you.
            </li>
            <li>
              <strong>INTERNET:</strong> Used only when the optional webhook feature is enabled,
              to POST battery data to the URL you configure. Not used otherwise.
            </li>
            <li>
              <strong>RECEIVE_BOOT_COMPLETED / FOREGROUND_SERVICE:</strong> Allows background
              monitoring to persist across reboots and while the screen is off.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Third-Party Services</h2>
          <p>
            WattWarden contains no ads and no analytics SDKs. The only outbound network traffic
            is the optional webhook described above, which connects to a URL you provide.
          </p>
          <p className="mt-2 font-mono text-sm bg-[var(--bg2)] border border-[var(--border)] rounded p-3">
            TODO: Confirm whether WorkManager schedules any periodic network calls beyond the
            user-triggered webhook, and disclose if so.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Children</h2>
          <p>WattWarden does not knowingly collect data from children under 13.</p>
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
