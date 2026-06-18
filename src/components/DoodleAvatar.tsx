'use client';

import React, { useEffect, useRef, useState } from 'react';

const thoughts = [
  { icon: 'fa-solid fa-robot',         text: 'Build AI stuff',  delay: 0   },
  { icon: 'fa-brands fa-python',        text: 'Python > Java',   delay: 0.8 },
  { icon: 'fa-solid fa-chart-bar',      text: 'Data = Gold',     delay: 1.6 },
  { icon: 'fa-solid fa-rocket',         text: 'Ship fast!',      delay: 2.4 },
];

export default function DoodleAvatar() {
  const [activeThought, setActiveThought] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Rotate thoughts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveThought((p) => (p + 1) % thoughts.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`doodle-avatar-wrap ${visible ? 'dav-visible' : ''}`}
      aria-hidden="true"
    >
      {/* ── SVG Doodle Layer (behind photo) ── */}
      <svg
        className="doodle-svg doodle-svg-back"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wobbly orbit ring */}
        <ellipse
          cx="200" cy="200" rx="160" ry="155"
          stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="6 10" opacity="0.35"
          className="doodle-orbit"
        />
        {/* Outer dashed ring */}
        <circle
          cx="200" cy="200" r="178"
          stroke="var(--accent2)" strokeWidth="0.8" strokeDasharray="3 14" opacity="0.2"
          className="doodle-orbit-rev"
        />

        {/* Squiggly arrow pointing to photo */}
        <path
          d="M 60 100 C 70 80, 90 70, 100 90 C 110 108, 108 130, 120 135"
          stroke="var(--accent3)" strokeWidth="1.8" strokeLinecap="round" opacity="0.55"
          className="doodle-draw"
        />
        <path d="M 115 130 L 120 135 L 124 127" stroke="var(--accent3)" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />

        {/* Stars / sparkles */}
        <g className="doodle-sparkle doodle-sparkle-1">
          <line x1="50" y1="230" x2="50" y2="246" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="42" y1="238" x2="58" y2="238" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44.3" y1="232.3" x2="55.7" y2="243.7" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="55.7" y1="232.3" x2="44.3" y2="243.7" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <g className="doodle-sparkle doodle-sparkle-2">
          <line x1="340" y1="135" x2="340" y2="147" stroke="var(--accent2)" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="334" y1="141" x2="346" y2="141" stroke="var(--accent2)" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="336.4" y1="136.4" x2="343.6" y2="145.6" stroke="var(--accent2)" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="343.6" y1="136.4" x2="336.4" y2="145.6" stroke="var(--accent2)" strokeWidth="1.1" strokeLinecap="round" />
        </g>
        <g className="doodle-sparkle doodle-sparkle-3">
          <line x1="310" y1="310" x2="310" y2="322" stroke="var(--accent3)" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="304" y1="316" x2="316" y2="316" stroke="var(--accent3)" strokeWidth="1.3" strokeLinecap="round" />
        </g>

        {/* Tiny dots constellation */}
        {[
          [70,170],[90,290],[130,350],[280,360],[345,280],[370,190],[330,80],[200,40],[100,60]
        ].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" fill="var(--accent)" opacity="0.25" className={`doodle-dot doodle-dot-${i}`} />
        ))}

        {/* Connecting lines (constellation) */}
        <polyline
          points="70,170 90,290 130,350 280,360 345,280 370,190 330,80 200,40 100,60 70,170"
          stroke="var(--accent)" strokeWidth="0.6" strokeDasharray="4 8" opacity="0.15"
        />

        {/* Hand-drawn underline accent */}
        <path
          d="M 120 340 C 140 347, 165 342, 180 345 C 195 348, 210 343, 225 346"
          stroke="var(--accent2)" strokeWidth="2" strokeLinecap="round" opacity="0.5"
          className="doodle-draw-2"
        />

        {/* Tiny circuit traces */}
        <path
          d="M 340 240 L 355 240 L 355 255 L 365 255"
          stroke="var(--accent3)" strokeWidth="1" opacity="0.3" strokeLinecap="round"
        />
        <circle cx="340" cy="240" r="2.5" fill="var(--accent3)" opacity="0.3" />
        <circle cx="365" cy="255" r="2.5" fill="var(--accent3)" opacity="0.3" />
      </svg>

      {/* ── Photo Frame ── */}
      <div className="dav-photo-frame">
        <div className="dav-photo-glow" />
        <picture>
          <source srcSet="/profile.webp" type="image/webp" />
          <img
            src="/profile.png"
            alt="Rahul Baberwal – Backend Developer & AI Engineer"
            className="dav-photo"
            loading="lazy"
            width={230}
            height={230}
          />
        </picture>
        {/* Gradient overlay */}
        <div className="dav-overlay" />
      </div>

      {/* ── Thought Bubble ── */}
      <div className="dav-thought-wrap">
        {thoughts.map((t, i) => (
          <div
            key={i}
            className={`dav-thought ${i === activeThought ? 'dav-thought-active' : ''}`}
          >
            <i className={t.icon} />{' '}{t.text}
          </div>
        ))}
        {/* Bubble tail dots */}
        <span className="dav-bubble-dot dav-bd-1" />
        <span className="dav-bubble-dot dav-bd-2" />
        <span className="dav-bubble-dot dav-bd-3" />
      </div>

      {/* ── Floating Annotations ── */}
      <div className="dav-annotation dav-ann-1">
        <span className="dav-ann-line" />
        <span className="dav-ann-text">MSc CS @ MGSU</span>
      </div>
      <div className="dav-annotation dav-ann-2">
        <span className="dav-ann-text">IIT Ropar AI</span>
        <span className="dav-ann-line" />
      </div>
      <div className="dav-annotation dav-ann-3">
        <span className="dav-ann-line" />
        <span className="dav-ann-text">Groww Per Click</span>
      </div>

      {/* ── Tech Badges floating ── */}
      <div className="dav-badge dav-badge-1"><i className="fa-brands fa-python" /> Python</div>
      <div className="dav-badge dav-badge-2"><i className="fa-solid fa-brain" /> ML</div>
      <div className="dav-badge dav-badge-3"><i className="fa-solid fa-bolt" /> FastAPI</div>
    </div>
  );
}
