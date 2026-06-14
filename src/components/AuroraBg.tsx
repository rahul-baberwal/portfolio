'use client';

import React, { useEffect, useRef } from 'react';

/* Floating code snippets scattered in background */
const CODE_FRAGMENTS = [
  'model.fit(X, y)',
  'async def predict():',
  'torch.no_grad()',
  'SELECT * FROM neurons',
  'git push origin main',
  'return Response(data)',
  'loss.backward()',
  'df.dropna(inplace=True)',
  'curl -X POST /api',
  'pip install magic',
  'kubectl apply -f',
  'np.array([1,2,3])',
];

export default function AuroraBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    // Particles
    const PARTICLE_COUNT = 80;
    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      color: string;
      alpha: number;
    }
    const particles: Particle[] = [];

    const COLORS = ['108,99,255', '255,101,132', '67,233,123'];

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.5 + 0.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: Math.random() * 0.5 + 0.15,
        });
      }
    }

    let t = 0;

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      t += 0.003;

      // ── Aurora blobs ──────────────────────────────────────────────────
      const blobs = [
        { x: w * 0.2 + Math.sin(t * 0.7) * w * 0.08, y: h * 0.25 + Math.cos(t * 0.5) * h * 0.06, rx: w * 0.28, ry: h * 0.22, c: '108,99,255', a: 0.06 },
        { x: w * 0.75 + Math.cos(t * 0.6) * w * 0.06, y: h * 0.55 + Math.sin(t * 0.8) * h * 0.08, rx: w * 0.22, ry: h * 0.28, c: '255,101,132', a: 0.05 },
        { x: w * 0.5 + Math.sin(t * 0.4) * w * 0.1,  y: h * 0.8 + Math.cos(t * 0.6) * h * 0.05, rx: w * 0.18, ry: h * 0.2, c: '67,233,123', a: 0.04 },
        { x: w * 0.88 + Math.sin(t * 0.9) * w * 0.04, y: h * 0.15 + Math.cos(t * 0.7) * h * 0.05, rx: w * 0.14, ry: h * 0.16, c: '108,99,255', a: 0.04 },
      ];

      for (const b of blobs) {
        const grd = ctx!.createRadialGradient(b.x, b.y, 0, b.x, b.y, Math.max(b.rx, b.ry));
        grd.addColorStop(0, `rgba(${b.c},${b.a})`);
        grd.addColorStop(1, `rgba(${b.c},0)`);
        ctx!.save();
        ctx!.scale(b.rx / Math.max(b.rx, b.ry), b.ry / Math.max(b.rx, b.ry));
        ctx!.beginPath();
        ctx!.arc(b.x / (b.rx / Math.max(b.rx, b.ry)), b.y / (b.ry / Math.max(b.rx, b.ry)), Math.max(b.rx, b.ry), 0, Math.PI * 2);
        ctx!.fillStyle = grd;
        ctx!.fill();
        ctx!.restore();
      }

      // ── Particles + connections ───────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx!.fill();

        // Connect nearby
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.strokeStyle = `rgba(${p.color},${(1 - dist / 130) * 0.12})`;
            ctx!.lineWidth = 0.6;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();

    window.addEventListener('resize', () => { resize(); initParticles(); });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Canvas for particles + aurora */}
      <canvas
        ref={canvasRef}
        id="aurora-canvas"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating code fragments */}
      <div className="code-fragments-layer" aria-hidden="true">
        {CODE_FRAGMENTS.map((frag, i) => (
          <span
            key={i}
            className={`code-frag code-frag-${i}`}
          >
            {frag}
          </span>
        ))}
      </div>

      {/* SVG line art overlay — unique geometric scribble */}
      <svg
        className="bg-lineart"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Corner bracket decorations */}
        <path d="M 0 0 L 80 0 L 80 8 M 0 0 L 0 80 L 8 80"
          stroke="rgba(108,99,255,0.18)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 1440 0 L 1360 0 L 1360 8 M 1440 0 L 1440 80 L 1432 80"
          stroke="rgba(108,99,255,0.18)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 0 900 L 80 900 L 80 892 M 0 900 L 0 820 L 8 820"
          stroke="rgba(108,99,255,0.12)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 1440 900 L 1360 900 L 1360 892 M 1440 900 L 1440 820 L 1432 820"
          stroke="rgba(108,99,255,0.12)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Abstract wave lines */}
        <path
          d="M -100 500 C 200 420, 400 580, 600 500 C 800 420, 1000 560, 1200 480 C 1300 440, 1380 500, 1540 470"
          stroke="rgba(108,99,255,0.06)" strokeWidth="1" fill="none"
        />
        <path
          d="M -100 520 C 200 440, 400 600, 600 520 C 800 440, 1000 580, 1200 500 C 1300 460, 1380 520, 1540 490"
          stroke="rgba(255,101,132,0.05)" strokeWidth="1" fill="none"
        />

        {/* Cross-hatch marks */}
        {[100, 350, 600, 900, 1150, 1400].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${130 + (i % 3) * 250})`} opacity="0.15">
            <line x1="-8" y1="0" x2="8" y2="0" stroke="var(--accent)" strokeWidth="1.2" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="var(--accent)" strokeWidth="1.2" />
          </g>
        ))}
      </svg>
    </>
  );
}
