'use client';

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <span>
        © {currentYear} Rahul Baberwal — rahulbaberwal.com
      </span>
      <nav className="footer-social-links flex gap-3 text-xs" aria-label="Social profiles">
        <a href="https://www.linkedin.com/in/rahul-baberwal/" rel="me" target="_blank" aria-label="LinkedIn">LinkedIn</a>
        <a href="https://github.com/rahul-baberwal" rel="me" target="_blank" aria-label="GitHub">GitHub</a>
        <a href="https://gitlab.com/rahul-baberwal" rel="me" target="_blank" aria-label="GitLab">GitLab</a>
        <a href="https://www.instagram.com/rahulbaberwal.in/" rel="me" target="_blank" aria-label="Instagram">Instagram</a>
        <a href="https://about.me/rahulbaberwal/" rel="me" target="_blank" aria-label="About.me">About.me</a>
        <a href="https://pypi.org/user/rahulbaberwal/" rel="me" target="_blank" aria-label="PyPI">PyPI</a>
      </nav>
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
