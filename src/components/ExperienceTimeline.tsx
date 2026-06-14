'use client';

import React, { useEffect, useRef, useState } from 'react';
import { staticExperiences } from '../lib/static-data';

/* ─────────────────────────────────────────────
   Icons per entry (can be extended)
───────────────────────────────────────────── */
const ICONS = ['fa-solid fa-briefcase', 'fa-solid fa-brain', 'fa-solid fa-graduation-cap', 'fa-solid fa-certificate'];

export default function ExperienceTimeline() {
  const [visible, setVisible] = useState<boolean[]>(new Array(staticExperiences.length).fill(false));
  const [lineProgress, setLineProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Intersection observer for each card */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 120);
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* Scroll-driven vertical line fill */
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const { top, height } = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (windowH - top) / (height + windowH * 0.3)));
      setLineProgress(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="timeline-wrapper" ref={sectionRef}>
      {/* Vertical glowing beam */}
      <div className="timeline-beam">
        <div className="timeline-beam-fill" style={{ height: `${lineProgress * 100}%` }} />
        {/* Pulse orb that travels along the beam */}
        <div className="timeline-orb" style={{ top: `${lineProgress * 100}%` }} />
      </div>

      <div className="timeline-items">
        {staticExperiences.map((exp, i) => {
          const isEven = i % 2 === 0;
          const icon = ICONS[i % ICONS.length];
          return (
            <div
              key={exp.id}
              className={`tl-item ${isEven ? 'tl-left' : 'tl-right'} ${visible[i] ? 'tl-visible' : ''}`}
              ref={(el) => { itemRefs.current[i] = el; }}
            >
              {/* Connector line from card to center */}
              <div className="tl-connector" />

              {/* Center dot */}
              <div className="tl-dot">
                <div className="tl-dot-ring" />
                <i className={icon} />
              </div>

              {/* The card itself */}
              <div className="tl-card" style={{ '--tl-delay': `${i * 0.1}s` } as React.CSSProperties}>
                {/* Holographic shimmer overlay */}
                <div className="tl-card-shimmer" />

                {/* Accent corner */}
                <div className="tl-card-corner" />

                <div className="tl-card-inner">
                  <div className="tl-date">
                    <i className="fa-regular fa-calendar-days" />
                    <span>{exp.date}</span>
                  </div>
                  <h3 className="tl-title">{exp.title}</h3>
                  <div className="tl-company">
                    <i className="fa-solid fa-building" />
                    <span>{exp.company}</span>
                  </div>
                  <p className="tl-desc">{exp.description}</p>
                </div>

                {/* Floating number badge */}
                <div className="tl-badge">{String(i + 1).padStart(2, '0')}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
