'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { useTerminal } from '../context/TerminalContext';

export default function InteractiveEffects() {
  const { cycleTheme } = useTheme();
  const { runSocialTerminal } = useTerminal();

  // Context Menu state
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; visible: boolean; flipX: boolean; flipY: boolean }>({
    x: 0,
    y: 0,
    visible: false,
    flipX: false,
    flipY: false,
  });

  const [copied, setCopied] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Custom cursor elements
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);


  // 1. Custom Cursor Loop
  useEffect(() => {
    let mx = 0, my = 0, tx = 0, ty = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mx - 6}px`;
        cursorRef.current.style.top = `${my - 6}px`;
      }
    };

    const animateTrail = () => {
      const dx = mx - tx;
      const dy = my - ty;
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        tx += dx * 0.12;
        ty += dy * 0.12;
        if (trailRef.current) {
          trailRef.current.style.left = `${tx - 20}px`;
          trailRef.current.style.top = `${ty - 20}px`;
        }
      }
      requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', onMouseMove);
    const rId = requestAnimationFrame(animateTrail);

    // Hover scale effects on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, .skill-card, .project-card');
      if (interactive && cursorRef.current && trailRef.current) {
        cursorRef.current.style.transform = 'scale(2)';
        cursorRef.current.style.background = 'var(--accent2)';
        trailRef.current.style.transform = 'scale(1.5)';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, .skill-card, .project-card');
      if (interactive && cursorRef.current && trailRef.current) {
        cursorRef.current.style.transform = 'scale(1)';
        cursorRef.current.style.background = 'var(--accent)';
        trailRef.current.style.transform = 'scale(1)';
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rId);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // 2. Ambient Particles System (optimized for performance)
  useEffect(() => {
    const createParticle = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      if (window.innerWidth < 768) return; // Skip particles on mobile for high performance
      
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      const colors = ['#6c63ff', '#ff6584', '#43e97b'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      p.style.cssText = `
        width:${size}px;height:${size}px;
        left:${x}vw;
        background:${color};
        animation-duration:${duration}s;
        animation-delay:${delay}s;
        opacity:0.4;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), (duration + delay) * 1000);
    };

    const interval = setInterval(createParticle, 2500);
    // Initial burst (smaller count)
    for (let i = 0; i < 3; i++) {
      setTimeout(createParticle, i * 300);
    }

    return () => clearInterval(interval);
  }, []);

  // 3. Context Menu Interceptor
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      const x = e.clientX;
      const y = e.clientY;
      const menuWidth = 190; // Approx menu size
      const menuHeight = 280;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const flipX = x + menuWidth > vw - 12;
      const flipY = y + menuHeight > vh - 12;

      setCtxMenu({
        x: flipX ? x - menuWidth : x,
        y: flipY ? y - menuHeight : y,
        visible: true,
        flipX,
        flipY,
      });
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setCtxMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleScroll = () => {
      setCtxMenu((prev) => ({ ...prev, visible: false }));
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCtxMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const copyPageUrl = () => {
    const url = window.location.href;
    setCtxMenu((prev) => ({ ...prev, visible: false }));

    const flashCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(flashCopied).catch(() => {
        fallbackCopy(url);
        flashCopied();
      });
    } else {
      fallbackCopy(url);
      flashCopied();
    }
  };

  const fallbackCopy = (text: string) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-999px;left:-999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      console.warn('Fallback copy failed', e);
    }
    ta.remove();
  };

  const viewSource = () => {
    setCtxMenu((prev) => ({ ...prev, visible: false }));
    const html = document.documentElement.outerHTML;
    const escaped = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const sourceTab = window.open('', '_blank');
    if (sourceTab) {
      sourceTab.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Source — rahulbaberwal.com</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: #0d1117;
      color: #c9d1d9;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.7;
      padding: 2rem;
    }
    pre { white-space: pre-wrap; word-break: break-all; }
    .tag   { color: #7ee787; }
    .attr  { color: #79c0ff; }
    .val   { color: #a5d6ff; }
    .cmt   { color: #8b949e; font-style: italic; }
    h1 {
      font-family: sans-serif;
      font-size: 0.75rem;
      color: #58a6ff;
      margin-bottom: 1.5rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <h1>📄 Page Source · rahulbaberwal.com</h1>
  <pre>${escaped}</pre>
</body>
</html>`);
      sourceTab.document.close();
    }
  };

  const handleAction = (action: string) => {
    setCtxMenu((prev) => ({ ...prev, visible: false }));
    if (action === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'theme') {
      cycleTheme();
    } else if (action === 'copy') {
      copyPageUrl();
    } else if (action === 'source') {
      viewSource();
    } else {
      runSocialTerminal(action as 'github' | 'gitlab' | 'linkedin' | 'facebook' | 'email');
    }
  };

  return (
    <>
      {/* Custom cursor elements */}
      <div id="cursor" ref={cursorRef} className="hidden md:block"></div>
      <div id="cursor-trail" ref={trailRef} className="hidden md:block"></div>

      {/* Floating Copied Alert */}
      {copied && (
        <div className="fixed bottom-8 right-8 z-[99999] bg-[var(--accent)] text-white px-4 py-2 rounded-lg font-mono text-sm shadow-lg border border-[var(--border)] animate-fadeIn">
          ✓ URL Copied to Clipboard
        </div>
      )}

      {/* Custom Context Menu */}
      {ctxMenu.visible && (
        <div
          id="ctx-menu"
          ref={menuRef}
          className={`ctx-menu-container ${ctxMenu.flipX ? 'flip-x' : ''} ${ctxMenu.flipY ? 'flip-y' : ''}`}
          style={{ left: `${ctxMenu.x}px`, top: `${ctxMenu.y}px` }}
        >
          <div className="ctx-header">
            <span className="ctx-logo">rb<span>.</span></span>
            <span className="ctx-version">v1.1 · Next.js</span>
          </div>
          <div className="ctx-separator"></div>

          <button className="ctx-item" onClick={() => handleAction('top')}>
            <span className="ctx-icon"><i className="fa-solid fa-arrow-up text-[12px]"></i></span>
            <span className="ctx-label font-mono">Scroll to Top</span>
            <span className="ctx-hint">Home</span>
          </button>
          
          <button className="ctx-item" onClick={() => handleAction('theme')}>
            <span className="ctx-icon"><i className="fa-solid fa-palette text-[12px]"></i></span>
            <span className="ctx-label font-mono">Change Theme</span>
            <span className="ctx-hint">Shake</span>
          </button>

          <button className="ctx-item" onClick={() => handleAction('copy')}>
            <span className="ctx-icon"><i className="fa-solid fa-link text-[12px]"></i></span>
            <span className="ctx-label font-mono">Copy Page URL</span>
            <span className="ctx-hint">Ctrl+C</span>
          </button>

          <div className="ctx-separator"></div>

          <button className="ctx-item" onClick={() => handleAction('github')}>
            <span className="ctx-icon text-[14px]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </span>
            <span className="ctx-label font-mono">GitHub</span>
            <span className="ctx-hint"><i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-60"></i></span>
          </button>

          <button className="ctx-item" onClick={() => handleAction('linkedin')}>
            <span className="ctx-icon text-[14px]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px]"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/></svg>
            </span>
            <span className="ctx-label font-mono">LinkedIn</span>
            <span className="ctx-hint"><i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-60"></i></span>
          </button>

          <button className="ctx-item" onClick={() => handleAction('email')}>
            <span className="ctx-icon"><i className="fa-regular fa-envelope text-[12px]"></i></span>
            <span className="ctx-label font-mono">Send Email</span>
            <span className="ctx-hint"><i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-60"></i></span>
          </button>

          <div className="ctx-separator"></div>

          <button className="ctx-item" onClick={() => handleAction('source')}>
            <span className="ctx-icon"><i className="fa-solid fa-code text-[12px]"></i></span>
            <span className="ctx-label font-mono">View Source</span>
            <span className="ctx-hint">Dev</span>
          </button>
        </div>
      )}
    </>
  );
}
