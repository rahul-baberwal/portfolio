'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTerminal } from '../context/TerminalContext';

const roles = [
  'Aspiring Data Scientist',
  'Full Stack Developer',
  'ML Engineer',
  'AI Enthusiast',
  'Django Developer',
];

// ─────────────────────────────────────────────────────────────
//  Liquid-fill SVG Name
//  Wave reacts to mouse Y / device gyro via levelRef
// ─────────────────────────────────────────────────────────────
function LiquidName({ levelRef }: { levelRef: React.MutableRefObject<number> }) {
  const phaseRef  = useRef(0);
  const rafRef    = useRef<number>(0);
  const [paths, setPaths] = useState({ wave: '', fillY: 160 });

  const W = 600, H = 260;

  useEffect(() => {
    let alive = true;
    const tick = () => {
      if (!alive) return;
      phaseRef.current += 0.03;
      const p  = phaseRef.current;
      const lv = levelRef.current;            // 0–100
      const fy = H * (1 - lv / 100);

      // Multi-harmonic wave for organic liquid feel
      const pts: string[] = [];
      for (let x = -30; x <= W + 30; x += 5) {
        const y =
          fy +
          Math.sin(x * 0.020 + p)       * 11 +
          Math.sin(x * 0.045 + p * 1.5) *  5 +
          Math.sin(x * 0.010 + p * 0.6) *  7;
        pts.push(`${x} ${y.toFixed(2)}`);
      }
      setPaths({
        wave : `M -30 ${fy} L ${pts.join(' L ')} L ${W+30} ${H} L -30 ${H} Z`,
        fillY: fy,
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(rafRef.current); };
  }, []); // runs once; reads levelRef each frame → no restarts

  const fStyle = {
    fontFamily : 'inherit, sans-serif',
    fontWeight : '800',
    letterSpacing: '-3',
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="liquid-name-svg"
      aria-label="Rahul Baberwal"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Clip text shapes */}
        <clipPath id="lnClip">
          <text x="2" y="130" fontSize="128" {...fStyle}>Rahul</text>
          <text x="2" y="252" fontSize="118" {...fStyle}>Baberwal</text>
        </clipPath>

        {/* Tech-coloured gradient: purple → cyan → green → pink */}
        <linearGradient id="lnGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="#6c63ff" />
          <stop offset="28%"  stopColor="#00d4ff" />
          <stop offset="60%"  stopColor="#43e97b" />
          <stop offset="100%" stopColor="#ff6584" />
        </linearGradient>

        {/* Shimmer sweep */}
        <linearGradient id="shimGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="50%"  stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
          <animateTransform
            attributeName="gradientTransform" type="translate"
            from={`-${W}`} to={`${W}`}
            dur="2.8s" repeatCount="indefinite"
          />
        </linearGradient>
      </defs>

      {/* Ghost outline text */}
      <text x="2" y="130"  fontSize="128" {...fStyle} fill="rgba(255,255,255,0.055)">Rahul</text>
      <text x="2" y="252"  fontSize="118" {...fStyle} fill="rgba(255,255,255,0.055)">Baberwal</text>

      {/* Liquid fill — clipped to letter shapes */}
      <g clipPath="url(#lnClip)">
        {/* Solid body below wave */}
        <rect x="-30" y={paths.fillY + 13} width={W + 60} height={H} fill="url(#lnGrad)" />
        {/* Animated wave surface */}
        <path d={paths.wave} fill="url(#lnGrad)" />
        {/* Shimmer gloss */}
        <rect x="-30" y="-5" width={W + 60} height={H + 10} fill="url(#shimGrad)" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
//  Hero Photo — vignette mask blends white BG into dark site
// ─────────────────────────────────────────────────────────────
function HeroPhoto() {
  return (
    <div className="hps-scene">
      {/* Pulsing ambient rings */}
      <div className="hps-ring hps-ring-1" />
      <div className="hps-ring hps-ring-2" />
      <div className="hps-ring hps-ring-3" />

      {/* Actual photo */}
      <img
        src="/hero-photo.webp"
        alt="Rahul Baberwal with headphones"
        className="hps-img"
        loading="eager"
        width={600}
        height={900}
      />

      {/* Scan line sweep */}
      <div className="hps-scan" aria-hidden="true" />

      {/* Floating code labels */}
      <span className="hps-chip hps-chip-1"><i className="fa-solid fa-robot" /> model.predict(X)</span>
      <span className="hps-chip hps-chip-2"><i className="fa-brands fa-python" /> Python 3.12</span>
      <span className="hps-chip hps-chip-3"><i className="fa-solid fa-bolt" /> FastAPI</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────
export default function TerminalHero() {
  const { runSocialTerminal } = useTerminal();
  const [typedRole, setTypedRole] = useState('');

  // Liquid level — smooth spring target
  const targetRef  = useRef(40);
  const levelRef   = useRef(40);     // passed directly into LiquidName
  const [, forceRender] = useState(0); // tiny re-render driver

  // ── Spring animation for liquid level ────────────────────────
  useEffect(() => {
    let rafId: number;
    const spring = () => {
      const diff = targetRef.current - levelRef.current;
      levelRef.current += diff * 0.05;   // spring damping
      rafId = requestAnimationFrame(spring);
    };
    rafId = requestAnimationFrame(spring);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ── Sensors ──────────────────────────────────────────────────
  useEffect(() => {
    // Desktop: mouse Y position
    const onMouse = (e: MouseEvent) => {
      const y = e.clientY / window.innerHeight;     // 0 (top) → 1 (bottom)
      targetRef.current = Math.round((1 - y) * 78 + 8); // 8% – 86%
    };

    // Mobile: device tilt (beta = -90 → 90 degrees)
    const onGyro = (e: DeviceOrientationEvent) => {
      if (e.beta === null) return;
      const t = Math.max(0, Math.min(100, ((e.beta + 90) / 180) * 100));
      targetRef.current = Math.round(t * 0.78 + 8);
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('deviceorientation', onGyro, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('deviceorientation', onGyro);
    };
  }, []);

  // ── Typewriter ────────────────────────────────────────────────
  useEffect(() => {
    let ri = 0, ci = 0, del = false, alive = true;
    const loop = () => {
      if (!alive) return;
      const cur = roles[ri];
      if (!del) {
        setTypedRole(cur.slice(0, ci + 1));
        ci++;
        if (ci === cur.length) { del = true; setTimeout(loop, 1800); return; }
      } else {
        setTypedRole(cur.slice(0, ci - 1));
        ci--;
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(loop, del ? 50 : 80);
    };
    loop();
    return () => { alive = false; };
  }, []);

  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="hero">
      <div className="hero-bg" />

      <div className="hero-inner">
        {/* ── LEFT: Text ── */}
        <div className="hero-left">
          {/* Liquid name */}
          <LiquidName levelRef={levelRef} />

          {/* Sensor hint — fades out after 4 s */}
          <p className="lq-hint">↕ move mouse · tilt phone to charge</p>

          {/* Typewriter subtitle */}
          <div className="hero-desc font-mono select-none mt-5">
            <span className="text-[var(--text3)]">&gt;&nbsp;</span>
            <span className="text-[var(--accent)] font-semibold">{typedRole}</span>
            <span className="animate-pulse text-[var(--accent)]">|</span>
            <br /><br />
            <p className="font-sans text-base leading-relaxed text-[var(--text2)] max-w-[480px]">
              MSc Computer Science · IIT Ropar AI · Building intelligent systems with Python, Django &amp; ML.
            </p>
          </div>

          {/* CTAs */}
          <div className="hero-ctas mt-8">
            <a href="#projects" onClick={(e) => scrollTo(e, 'projects')} className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              View Projects
            </a>
            <a href="#contact" onClick={(e) => scrollTo(e, 'contact')} className="btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,12 2,6" />
              </svg>
              Get in Touch
            </a>
          </div>
        </div>

        {/* ── RIGHT: Photo ── */}
        <div className="hero-right">
          <HeroPhoto />
        </div>
      </div>

      {/* Side social buttons */}
      <div className="hero-socials">
        {(
          [
            ['github', 'fa-brands fa-github'],
            ['gitlab', 'fa-brands fa-gitlab'],
            ['linkedin', 'fa-brands fa-linkedin-in'],
            ['facebook', 'fa-brands fa-facebook-f'],
            ['email', 'fa-regular fa-envelope'],
          ] as const
        ).map(([key, icon]) => (
          <button key={key} className="social-link" onClick={() => runSocialTerminal(key)} title={key}>
            <i className={`${icon} text-[18px]`} />
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-line" />
      </div>
    </section>
  );
}
