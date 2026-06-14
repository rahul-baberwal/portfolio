'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

export interface Theme {
  '--accent': string;
  '--accent2': string;
  '--accent3': string;
  '--bg': string;
  '--bg2': string;
  '--bg3': string;
  '--text': string;
  '--text2': string;
  '--text3': string;
  '--border': string;
  '--card': string;
  '--glow': string;
}

export const themes: Theme[] = [
  { // 0: Original
    '--accent': '#6c63ff', '--accent2': '#ff6584', '--accent3': '#43e97b',
    '--bg': '#0a0a0f', '--bg2': '#111118', '--bg3': '#16161f',
    '--text': '#f0f0fa', '--text2': '#9999bb', '--text3': '#555577',
    '--border': 'rgba(108, 99, 255, 0.15)', '--card': 'rgba(22, 22, 31, 0.8)',
    '--glow': 'rgba(108, 99, 255, 0.3)',
  },
  { // 1: Cyberpunk
    '--accent': '#00f5d4', '--accent2': '#f72585', '--accent3': '#fee440',
    '--bg': '#04040a', '--bg2': '#080813', '--bg3': '#0d0d1c',
    '--text': '#e8f8ff', '--text2': '#80c8cc', '--text3': '#3a666a',
    '--border': 'rgba(0, 245, 212, 0.15)', '--card': 'rgba(8, 8, 22, 0.85)',
    '--glow': 'rgba(0, 245, 212, 0.3)',
  },
  { // 2: Aurora
    '--accent': '#10b981', '--accent2': '#8b5cf6', '--accent3': '#f59e0b',
    '--bg': '#030a06', '--bg2': '#060f0a', '--bg3': '#0a1a10',
    '--text': '#ecfdf5', '--text2': '#6ee7b7', '--text3': '#2d6a4f',
    '--border': 'rgba(16, 185, 129, 0.15)', '--card': 'rgba(6, 15, 10, 0.85)',
    '--glow': 'rgba(16, 185, 129, 0.3)',
  },
  { // 3: Solar Flare
    '--accent': '#f97316', '--accent2': '#ef4444', '--accent3': '#fbbf24',
    '--bg': '#0c0700', '--bg2': '#180e00', '--bg3': '#1f1200',
    '--text': '#fff7ed', '--text2': '#fcd34d', '--text3': '#7c4700',
    '--border': 'rgba(249, 115, 22, 0.15)', '--card': 'rgba(24, 14, 0, 0.85)',
    '--glow': 'rgba(249, 115, 22, 0.3)',
  },
  { // 4: Ice Storm
    '--accent': '#38bdf8', '--accent2': '#c084fc', '--accent3': '#a7f3d0',
    '--bg': '#020b14', '--bg2': '#041322', '--bg3': '#071a2e',
    '--text': '#f0f9ff', '--text2': '#7dd3fc', '--text3': '#1e4c6e',
    '--border': 'rgba(56, 189, 248, 0.15)', '--card': 'rgba(4, 19, 34, 0.85)',
    '--glow': 'rgba(56, 189, 248, 0.3)',
  }
];

interface ThemeContextType {
  currentThemeIndex: number;
  cycleTheme: () => void;
  hasGyro: boolean;
  activateMotion: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeIndex, setCurrentThemeIndex] = useState<number>(0);
  const [hasGyro, setHasGyro] = useState<boolean>(false);
  const motionRef = useRef({ x: 0, y: 0, z: 0, tx: 0, ty: 0, tz: 0 });
  const hasGyroRef = useRef(false);
  const lastShakeRef = useRef(0);
  const initialZRef = useRef<number | null>(null);
  const initialYRef = useRef<number | null>(null);

  // Initialize and apply theme on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('selected-theme');
    let idx = 0;
    if (savedTheme !== null) {
      idx = parseInt(savedTheme, 10);
      if (isNaN(idx) || idx < 0 || idx >= themes.length) idx = 0;
    }
    setCurrentThemeIndex(idx);
    applyThemeVariables(idx);
  }, []);

  const applyThemeVariables = (index: number) => {
    const theme = themes[index];
    const root = document.documentElement;
    Object.keys(theme).forEach((key) => {
      root.style.setProperty(key, theme[key as keyof Theme]);
    });
  };

  const cycleTheme = () => {
    let next: number;
    setCurrentThemeIndex((prev) => {
      do {
        next = Math.floor(Math.random() * themes.length);
      } while (next === prev && themes.length > 1);
      
      applyThemeVariables(next);
      localStorage.setItem('selected-theme', String(next));
      return next;
    });

    const flash = document.createElement('div');
    flash.className = 'theme-flash-overlay';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 450);
  };

  const particleBurst = () => {
    const colors = ['#6c63ff', '#ff6584', '#43e97b'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle-burst';
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 10 + 5;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      p.style.setProperty('--vx', `${vx}vw`);
      p.style.setProperty('--vy', `${vy}vh`);
      p.style.background = colors[Math.floor(Math.random() * colors.length)];

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  };

  const triggerShakeEffect = () => {
    document.body.classList.add('glitch-active');
    particleBurst();
    setTimeout(() => {
      document.body.classList.remove('glitch-active');
      cycleTheme();
    }, 600);
  };

  // Parallax CSS variables updating via events for high performance
  useEffect(() => {
    let lastGx = 0, lastGy = 0;

    // Mouse fallback movement handler
    const handleMouseMove = (e: MouseEvent) => {
      if (hasGyroRef.current) return;
      const gx = parseFloat(((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
      const gy = parseFloat(((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
      
      const root = document.documentElement;
      if (Math.abs(gx - lastGx) > 0.01) {
        root.style.setProperty('--gx', String(gx));
        lastGx = gx;
      }
      if (Math.abs(gy - lastGy) > 0.01) {
        root.style.setProperty('--gy', String(gy));
        lastGy = gy;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Motion permission activation
  const activateMotion = () => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      if (!hasGyroRef.current) {
        hasGyroRef.current = true;
        setHasGyro(true);
      }

      let alpha = e.alpha;
      // Handle webkit heading if available
      const webkitHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      if (webkitHeading !== undefined) {
        alpha = 360 - webkitHeading;
      }

      if (initialZRef.current === null && alpha !== null) {
        initialZRef.current = alpha;
        initialYRef.current = e.beta;
      }

      motionRef.current.x = Math.max(-1, Math.min(1, e.gamma / 45));
      if (initialYRef.current !== null) {
        motionRef.current.y = Math.max(-1, Math.min(1, (e.beta - initialYRef.current) / 45));
      }
      if (alpha !== null && initialZRef.current !== null) {
        motionRef.current.z = alpha - initialZRef.current;
      }
    };

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;
      
      const total = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      const now = Date.now();

      if (total > 25 && now - lastShakeRef.current > 1500) {
        lastShakeRef.current = now;
        triggerShakeEffect();
      }
    };

    const requestPermission = typeof DeviceOrientationEvent !== 'undefined'
      ? (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission
      : undefined;

    if (typeof requestPermission === 'function') {
      requestPermission()
        .then((res: string) => {
          if (res === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
      window.addEventListener('devicemotion', handleMotion);
    }
  };

  // Add click/touchstart listeners to auto-grant gyroscope permission on interaction
  useEffect(() => {
    window.addEventListener('click', activateMotion, { once: true });
    window.addEventListener('touchstart', activateMotion, { once: true });
    return () => {
      window.removeEventListener('click', activateMotion);
      window.removeEventListener('touchstart', activateMotion);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ currentThemeIndex, cycleTheme, hasGyro, activateMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
