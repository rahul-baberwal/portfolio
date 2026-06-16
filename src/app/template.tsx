'use client';

import React, { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  // Always start as "first load" on server and initial client render to avoid
  // hydration mismatches. We read sessionStorage only after mount.
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Read sessionStorage after mount to avoid SSR/hydration mismatch
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    if (hasLoaded) {
      // Not the first load — trigger the slide-up animation
      setIsFirstLoad(false);
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      sessionStorage.setItem('hasLoaded', 'true');
    }
  }, []);

  return (
    <>
      {!isFirstLoad && (
        <div className={`page-swipe-loader ${!animating ? 'slide-up' : ''}`}>
          <div className="swipe-content">
            <div className="swipe-orb"></div>
            <div className="swipe-logo">rb<span>.</span></div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
