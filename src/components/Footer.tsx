'use client';

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <span>
        © {currentYear} Rahul Baberwal — rahulbaberwal.com ·{' '}
        <a href="/admin" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent)')} onMouseOut={(e) => (e.currentTarget.style.color = 'inherit')}>
          [CMS Portal]
        </a>
      </span>
      <span className="font-mono text-xs">
        Built with{' '}
        <i
          className="fa-solid fa-heart"
          style={{ color: 'var(--accent2)', fontSize: '0.8rem', margin: '0 2px' }}
        ></i>{' '}
        by Rahul Baberwal
      </span>
    </footer>
  );
}
