'use client';

import React, { useState } from 'react';

export default function CopyInstallButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--bg2)] border border-[var(--border)] font-mono text-sm mb-6">
      <span className="text-[var(--text3)] select-none">$</span>
      <code className="text-[var(--text)] select-all">{command}</code>
      <button
        type="button"
        onClick={handleCopy}
        className="ml-2 px-2.5 py-1 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-xs text-[var(--text2)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-colors"
        aria-label="Copy install command"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
